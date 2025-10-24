package com.saif.portfolio.service.impl;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HashSet;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.saif.portfolio.config.CustomUserDetails;
import com.saif.portfolio.dto.ForgotPasswordRequest;
import com.saif.portfolio.dto.LoginRequest;
import com.saif.portfolio.dto.RegisterRequest;
import com.saif.portfolio.dto.ResetPasswordRequest;
import com.saif.portfolio.dto.TokenResponse;
import com.saif.portfolio.dto.VerifyEmailRequest;
import com.saif.portfolio.exception.AccountLockedException;
import com.saif.portfolio.exception.EmailAlreadyVerifyException;
import com.saif.portfolio.exception.InvalidCredentialsException;
import com.saif.portfolio.exception.InvalidOtpException;
import com.saif.portfolio.exception.InvalidTokenException;
import com.saif.portfolio.exception.ResourceNotFoundException;
import com.saif.portfolio.exception.TooManyRequestsException;
import com.saif.portfolio.exception.UserAlreadyExistsException;
import com.saif.portfolio.exception.VerifyEmailException;
import com.saif.portfolio.model.EmailVerification;
import com.saif.portfolio.model.FailedLogin;
import com.saif.portfolio.model.OAuthAccount;
import com.saif.portfolio.model.PasswordReset;
import com.saif.portfolio.model.RefreshToken;
import com.saif.portfolio.model.Role;
import com.saif.portfolio.model.User;
import com.saif.portfolio.service.AuthService;
import com.saif.portfolio.service.EmailService;
import com.saif.portfolio.service.EmailVerificationService;
import com.saif.portfolio.service.FailedLoginService;
import com.saif.portfolio.service.OAuthAccountService;
import com.saif.portfolio.service.PasswordResetService;
import com.saif.portfolio.service.RefreshTokenService;
import com.saif.portfolio.service.RoleService;
import com.saif.portfolio.service.UserService;
import com.saif.portfolio.util.JwtUtil;
import com.saif.portfolio.util.SecurityUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserService userService;
    private final RoleService roleService;
    private final EmailVerificationService emailVerificationService;
    private final PasswordResetService passwordResetService;
    private final RefreshTokenService refreshTokenService;
    private final FailedLoginService failedLoginService;
    private final OAuthAccountService oAuthAccountService;
    private final SecurityUtil securityUtil;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;
    private final AuthenticationManager authenticationManager;

    @Value("${otp.expiry-minutes}")
    private int otpExpiryMinutes;

    @Value("${password-reset.expiry-minutes}")
    private int resetExpiryMinutes;

    @Value("${otp.length}")
    private int otpLength;

    @Override
    @Transactional
    public void register(RegisterRequest request) {
        log.info("Registering user with email: {}", request.getEmail());
        if (userService.existsByEmail(request.getEmail())) {
            log.warn("Registration failed: Email {} already exists", request.getEmail());
            throw new UserAlreadyExistsException("Email already registered");
        }

        Role userRole = roleService.findByName("ROLE_USER")
                .orElseThrow(() -> new ResourceNotFoundException("ROLE_USER not found"));

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(securityUtil.hashPassword(request.getPassword()))
                .fullName(request.getFullName())
                .username(request.getUsername())
                .isActive(true)
                .isEmailVerified(false)
                .roles(new HashSet<>())
                .build();
        user.getRoles().add(userRole);
        userService.save(user);

        String otp = securityUtil.generateOtp(otpLength);
        EmailVerification verification = EmailVerification.builder()
                .user(user)
                .otpHash(securityUtil.hashToken(otp))
                .expiresAt(Instant.now().plus(otpExpiryMinutes, ChronoUnit.MINUTES))
                .build();
        emailVerificationService.save(verification);
        emailService.sendOtpEmail(user.getEmail(), otp, "Verify Your Email");

        log.info("User registered, OTP sent to: {}", user.getEmail());
    }

    @Override
    @Transactional
    public void verifyEmail(VerifyEmailRequest request) {
        log.info("Verifying email for: {}", request.getEmail());
        User user = userService.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getIsEmailVerified()) {
            throw new EmailAlreadyVerifyException("Email already verified");
        }

        EmailVerification verification = emailVerificationService.findActiveByUser(user, Instant.now())
                .orElseThrow(() -> new InvalidOtpException("OTP expired or not found"));

        if (!securityUtil.matchesToken(request.getOtp(), verification.getOtpHash())) {
            throw new InvalidOtpException("Invalid OTP");
        }

        verification.setConsumed(true);
        emailVerificationService.save(verification);
        emailVerificationService.deleteExpiredOrConsumed(Instant.now());
        user.setIsEmailVerified(true);
        userService.save(user);

    }

    @Override
    @Transactional
    public void resendEmailVerificationOtp(String email) {
        User user = userService.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getIsEmailVerified()) {
            throw new EmailAlreadyVerifyException("Email already verified");
        }

        // Check if there is any active (non-expired, non-consumed) OTP
        Optional<EmailVerification> existingOtp = emailVerificationService.findActiveByUser(user, Instant.now());

        if (existingOtp.isPresent()) {
            throw new TooManyRequestsException("OTP already sent. Please wait until it expires.");
        }

        // Generate new OTP
        String otp = securityUtil.generateOtp(otpLength);
        String otpHash = securityUtil.hashToken(otp);

        // Create new EmailVerification
        EmailVerification verification = EmailVerification.builder()
                .user(user)
                .otpHash(otpHash)
                .expiresAt(Instant.now().plus(otpExpiryMinutes, ChronoUnit.MINUTES))
                .consumed(false)
                .build();

        // Save to DB
        emailVerificationService.save(verification);

        // Send OTP via email
        emailService.sendOtpEmail(user.getEmail(), otp, "Verify Your Email");

        log.info("Resent OTP to email: {}", user.getEmail());
    }

    @Override
    @Transactional(noRollbackFor = InvalidCredentialsException.class)
    public TokenResponse login(LoginRequest request, String ip) {
        log.info("Login attempt for email: {}, IP: {}", request.getEmail(), ip);

        User user = userService.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // ✅ Check if email is verified
        if (!user.getIsEmailVerified()) {
            log.warn("Login blocked: Email not verified for {}", request.getEmail());
            throw new VerifyEmailException("Please verify your email before logging in");
        }

        // Check for lockout
        Instant fifteenMinAgo = Instant.now().minus(15, ChronoUnit.MINUTES);
        int fails = failedLoginService.countRecentByUserId(user.getId(), fifteenMinAgo);
        if (fails >= 5) {
            log.warn("Account locked for email: {} due to too many failed attempts", request.getEmail());
            throw new AccountLockedException("Account locked due to too many failed attempts");
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String tokenVersion = user.getTokenVersion();
            String accessToken = jwtUtil.generateAccessToken(userDetails, tokenVersion);
            String refreshToken = jwtUtil.generateRefreshToken(userDetails, tokenVersion);

            RefreshToken rt = RefreshToken.builder()
                    .user(user)
                    .tokenHash(securityUtil.hashToken(refreshToken))
                    .expiresAt(Instant.now().plus(jwtUtil.getRefreshExpiration() / 1000, ChronoUnit.SECONDS))
                    .deviceInfo(request.getDeviceInfo())
                    .build();
            refreshTokenService.save(rt);

            log.info("Login successful for email: {}", request.getEmail());
            return new TokenResponse(accessToken, refreshToken);
        } catch (BadCredentialsException e) {
            FailedLogin failedLogin = FailedLogin.builder()
                    .user(user)
                    .ip(ip)
                    .build();
            failedLoginService.save(failedLogin);
            log.warn("Login failed for email: {}", request.getEmail());
            throw new InvalidCredentialsException("Invalid credentials");
        }
    }

    @Override
    @Transactional
    public TokenResponse refreshToken(String refreshToken) {
        log.info("Refreshing token");
        RefreshToken rt = refreshTokenService.findByTokenHash(securityUtil.hashToken(refreshToken))
                .orElseThrow(() -> new InvalidTokenException("Invalid refresh token"));

        if (rt.getRevoked() || rt.getExpiresAt().isBefore(Instant.now())) {
            log.warn("Refresh token revoked or expired");
            throw new InvalidTokenException("Refresh token revoked or expired");
        }

        User user = rt.getUser();
        UserDetails userDetails = loadUserDetails(user);
        String tokenVersion = user.getTokenVersion();
        String newAccessToken = jwtUtil.generateAccessToken(userDetails, tokenVersion);
        String newRefreshToken = jwtUtil.generateRefreshToken(userDetails, tokenVersion);

        rt.setRevoked(true);

        refreshTokenService.save(rt);

        RefreshToken newRt = RefreshToken.builder()
                .user(user)
                .tokenHash(securityUtil.hashToken(newRefreshToken))
                .expiresAt(Instant.now().plus(jwtUtil.getRefreshExpiration() / 1000, ChronoUnit.SECONDS))
                .deviceInfo(rt.getDeviceInfo())
                .build();
        refreshTokenService.save(newRt);

        log.info("Token refreshed for user: {}", user.getEmail());
        return new TokenResponse(newAccessToken, newRefreshToken);
    }

    @Override
    @Transactional
    public void logout(String refreshToken) {
        log.info("Logging out with refresh token");
        RefreshToken rt = refreshTokenService.findByTokenHash(securityUtil.hashToken(refreshToken))
                .orElseThrow(() -> new InvalidTokenException("Invalid refresh token"));

        rt.setRevoked(true);
        refreshTokenService.save(rt);

        log.info("Logout successful for user: {}", rt.getUser().getEmail());
    }

    @Override
    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        String email = request.getEmail();
        log.info("Forgot password requested for: {}", securityUtil.maskEmail(email)); // ✅ Masked Log

        // 1️⃣ Validate user existence
        User user = userService.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("If this email exists, a reset token will be sent"));
        // ✅ Avoid leaking if user exists or not

        // 2️⃣ Check existing active token
        passwordResetService.findActiveByUser(user)
                .ifPresent(existing -> {
                    log.warn("Active password reset token already exists for user: {}", securityUtil.maskEmail(user.getEmail()));
                    throw new TooManyRequestsException("A reset request is already in progress. Please wait until it expires.");
                });

        // 3️⃣ Generate secure OTP token
        String rawToken = securityUtil.generateOtp(otpLength);
        String hashedToken = securityUtil.hashToken(rawToken); // ✅ Store only hashed version for security

        PasswordReset reset = PasswordReset.builder()
                .user(user)
                .tokenHash(hashedToken)
                .expiresAt(Instant.now().plus(resetExpiryMinutes, ChronoUnit.MINUTES))
                .build();

        passwordResetService.save(reset); // ✅ Save reset record for tracking

        // 4️⃣ Send Token via Email (Raw token only here)
        emailService.sendResetTokenEmail(user.getEmail(), rawToken, "Password Reset Token");

        log.info("Password reset token generated and email triggered for: {}", securityUtil.maskEmail(user.getEmail()));

        // TODO: ✅ Add rate-limiting by IP or email to prevent abuse
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        log.info("Resetting password with token");
        PasswordReset reset = passwordResetService.findByTokenHash(securityUtil.hashToken(request.getToken()))
                .orElseThrow(() -> new InvalidTokenException("Invalid or consumed reset token"));

        if (reset.getExpiresAt().isBefore(Instant.now())) {
            log.warn("Reset token expired");
            throw new InvalidTokenException("Reset token expired");
        }

        User user = reset.getUser();
        user.setPasswordHash(securityUtil.hashPassword(request.getNewPassword()));

        // Revoke all refresh tokens + update token version
        refreshTokenService.revokeAllByUserId(user.getId());
        user.setTokenVersion(UUID.randomUUID().toString());

        userService.save(user);
        reset.setConsumed(true);
        passwordResetService.save(reset);

        log.info("Password reset successful for: {}", user.getEmail());

    }

    @Override
    @Transactional
    public void logoutAllOtherDevices(String currentRefreshToken) {
        RefreshToken token = refreshTokenService.findByTokenHash(securityUtil.hashToken(currentRefreshToken))
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        Long userId = token.getUser().getId();

        // ✅ Revoke all tokens for this user except the current one
        refreshTokenService.revokeAllExcept(userId, currentRefreshToken);

        log.info("User {} logged out from all other devices.", token.getUser().getEmail());
    }

    @Override
    @Transactional
    public TokenResponse socialLogin(String provider, String providerUserId, Map<String, Object> profile) {
        log.info("Social login attempt for provider: {}, userId: {}", provider, providerUserId);
        Optional<OAuthAccount> accountOpt = oAuthAccountService.findByProviderAndProviderUserId(provider, providerUserId);
        User user;

        if (accountOpt.isPresent()) {
            user = accountOpt.get().getUser();
        } else {
            String email = (String) profile.get("email");
            if (userService.existsByEmail(email)) {
                log.warn("Social login failed: Email {} already registered", email);
                throw new UserAlreadyExistsException("Email already registered");
            }

            Role userRole = roleService.findByName("ROLE_USER")
                    .orElseThrow(() -> new RuntimeException("ROLE_USER not found"));

            user = User.builder()
                    .email(email)
                    .fullName((String) profile.get("name"))
                    .isActive(true)
                    .isEmailVerified(true)
                    .roles(new HashSet<>())
                    .build();
            user.getRoles().add(userRole);
            userService.save(user);

            OAuthAccount account = OAuthAccount.builder()
                    .user(user)
                    .provider(provider)
                    .providerUserId(providerUserId)
                    .providerData(profile.toString())
                    .build();
            oAuthAccountService.save(account);
        }

        UserDetails userDetails = loadUserDetails(user);
        String tokenVersion = user.getTokenVersion();
        String accessToken = jwtUtil.generateAccessToken(userDetails, tokenVersion);
        String refreshToken = jwtUtil.generateRefreshToken(userDetails, tokenVersion);

        RefreshToken rt = RefreshToken.builder()
                .user(user)
                .tokenHash(securityUtil.hashToken(refreshToken))
                .expiresAt(Instant.now().plus(jwtUtil.getRefreshExpiration() / 1000, ChronoUnit.SECONDS))
                .deviceInfo("OAuth:" + provider)
                .build();
        refreshTokenService.save(rt);

        log.info("Social login successful for: {}", user.getEmail());
        return new TokenResponse(accessToken, refreshToken);
    }

    private UserDetails loadUserDetails(User user) {
        return new CustomUserDetails(
                user.getEmail(),
                user.getPasswordHash() != null ? user.getPasswordHash() : "",
                user.getIsActive() && user.getIsEmailVerified(),
                user.getRoles().stream()
                        .map(role -> new org.springframework.security.core.authority.SimpleGrantedAuthority(role.getName()))
                        .collect(Collectors.toSet()),
                user.getTokenVersion() // ✅ include tokenVersion
        );
    }

}
