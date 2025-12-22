package com.saif.portfolio.service.impl;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HashSet;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
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
@Transactional
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

    // ---------------- REGISTER ----------------
    @Override
    public void register(RegisterRequest request) {

        if (userService.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("Email already registered");
        }

        Role role = roleService.findByName("ROLE_USER")
                .orElseThrow(() -> new ResourceNotFoundException("ROLE_USER not found"));

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(securityUtil.hashPassword(request.getPassword()))
                .fullName(request.getFullName())
                .username(request.getUsername())
                .isActive(true)
                .isEmailVerified(false)
                .roles(new HashSet<>(Set.of(role)))
                .tokenVersion(UUID.randomUUID().toString())
                .build();

        userService.save(user);
        sendEmailVerificationOtp(user);
    }

    // ---------------- EMAIL VERIFY ----------------
    @Override
    public void verifyEmail(VerifyEmailRequest request) {

        User user = userService.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getIsEmailVerified()) {
            throw new EmailAlreadyVerifyException("Email already verified");
        }

        EmailVerification verification
                = emailVerificationService.findActiveByUser(user, Instant.now())
                        .orElseThrow(() -> new InvalidOtpException("OTP expired or invalid"));

        if (!securityUtil.matchesToken(request.getOtp(), verification.getOtpHash())) {
            throw new InvalidOtpException("Invalid OTP");
        }

        verification.setConsumed(true);
        user.setIsEmailVerified(true);

        emailVerificationService.save(verification);
        userService.save(user);
    }

    // ---------------- LOGIN ----------------
    @Override
    public TokenResponse login(LoginRequest request, String ip) {

        User user = userService.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!user.getIsEmailVerified()) {
            throw new VerifyEmailException("Verify email first");
        }

        Instant cutoff = Instant.now().minus(15, ChronoUnit.MINUTES);
        if (failedLoginService.countRecentByUserId(user.getId(), cutoff) >= 5) {
            throw new AccountLockedException("Too many failed attempts");
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(), request.getPassword()
                    )
            );

            return issueTokens(user, request.getDeviceInfo());

        } catch (BadCredentialsException ex) {
            failedLoginService.save(FailedLogin.builder()
                    .user(user)
                    .ip(ip)
                    .build());
            throw new InvalidCredentialsException("Invalid credentials");
        }
    }

    // ---------------- REFRESH TOKEN ----------------
    @Override
    public TokenResponse refreshToken(String refreshToken) {

        RefreshToken stored = refreshTokenService
                .findByTokenHash(securityUtil.hashToken(refreshToken))
                .orElseThrow(() -> new InvalidTokenException("Invalid refresh token"));

        if (stored.getRevoked() || stored.getExpiresAt().isBefore(Instant.now())) {
            // 🔥 TOKEN REUSE / COMPROMISE
            refreshTokenService.revokeAllByUserId(stored.getUser().getId());
            throw new InvalidTokenException("Session expired. Login again.");
        }

        log.warn("Refresh token reuse detected for user {}", stored.getUser().getEmail());


        stored.setRevoked(true);
        refreshTokenService.save(stored);

        return issueTokens(stored.getUser(), stored.getDeviceInfo());
    }

    // ---------------- LOGOUT ----------------
    @Override
    public void logout(String refreshToken) {

        refreshTokenService.findByTokenHash(securityUtil.hashToken(refreshToken))
                .ifPresent(rt -> {
                    rt.setRevoked(true);
                    refreshTokenService.save(rt);
                });
    }

    @Override
    public void logoutAllOtherDevices(String currentRefreshToken) {

        RefreshToken token = refreshTokenService
                .findByTokenHash(securityUtil.hashToken(currentRefreshToken))
                .orElseThrow(() -> new InvalidTokenException("Invalid token"));

        refreshTokenService.revokeAllExcept(
                token.getUser().getId(),
                token.getTokenHash()
        );
    }

    // ---------------- PASSWORD RESET ----------------
    @Override
    public void forgotPassword(ForgotPasswordRequest request) {

        userService.findByEmail(request.getEmail()).ifPresent(user -> {

            passwordResetService.findActiveByUser(user).ifPresent(r -> {
                throw new TooManyRequestsException("Reset already requested");
            });

            String raw = securityUtil.generateOtp(otpLength);

            PasswordReset reset = PasswordReset.builder()
                    .user(user)
                    .tokenHash(securityUtil.hashToken(raw))
                    .expiresAt(Instant.now().plus(resetExpiryMinutes, ChronoUnit.MINUTES))
                    .build();

            passwordResetService.save(reset);
            emailService.sendResetTokenEmail(user.getEmail(), raw, "Password Reset");
        });
    }

    @Override
    public void resetPassword(ResetPasswordRequest request) {

        PasswordReset reset = passwordResetService
                .findByTokenHash(securityUtil.hashToken(request.getToken()))
                .orElseThrow(() -> new InvalidTokenException("Invalid token"));

        if (reset.getExpiresAt().isBefore(Instant.now())) {
            throw new InvalidTokenException("Token expired");
        }

        User user = reset.getUser();
        user.setPasswordHash(securityUtil.hashPassword(request.getNewPassword()));
        user.setTokenVersion(UUID.randomUUID().toString());

        refreshTokenService.revokeAllByUserId(user.getId());

        reset.setConsumed(true);
        userService.save(user);
        passwordResetService.save(reset);
    }

    @Override
    @Transactional
    public void resendEmailVerificationOtp(String email) {

        User user = userService.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // ✅ Already verified → no resend
        if (user.getIsEmailVerified()) {
            throw new EmailAlreadyVerifyException("Email already verified");
        }

        // ✅ Rate limit: active OTP already exists
        Optional<EmailVerification> activeOtp
                = emailVerificationService.findActiveByUser(user, Instant.now());

        if (activeOtp.isPresent()) {
            throw new TooManyRequestsException(
                    "OTP already sent. Please wait until it expires."
            );
        }

        // ✅ Generate fresh OTP
        String otp = securityUtil.generateOtp(otpLength);

        EmailVerification verification = EmailVerification.builder()
                .user(user)
                .otpHash(securityUtil.hashToken(otp))
                .expiresAt(Instant.now().plus(otpExpiryMinutes, ChronoUnit.MINUTES))
                .consumed(false)
                .build();

        emailVerificationService.save(verification);

        // ✅ Send email
        emailService.sendOtpEmail(
                user.getEmail(),
                otp,
                "Verify Your Email"
        );

        log.info("Resent email verification OTP for {}", securityUtil.maskEmail(user.getEmail()));
    }

    // ---------------- SOCIAL LOGIN ----------------
    @Override
    public TokenResponse socialLogin(String provider, String providerUserId, Map<String, Object> profile) {

        OAuthAccount account = oAuthAccountService
                .findByProviderAndProviderUserId(provider, providerUserId)
                .orElseGet(() -> createOAuthUser(provider, providerUserId, profile));

        return issueTokens(account.getUser(), "OAuth:" + provider);
    }

    // ---------------- HELPERS ----------------
    private TokenResponse issueTokens(User user, String deviceInfo) {

        UserDetails userDetails = toUserDetails(user);

        String access = jwtUtil.generateAccessToken(userDetails, user.getTokenVersion());
        String refresh = jwtUtil.generateRefreshToken(userDetails, user.getTokenVersion());

        refreshTokenService.save(
                RefreshToken.builder()
                        .user(user)
                        .tokenHash(securityUtil.hashToken(refresh))
                        .expiresAt(Instant.now()
                                .plus(jwtUtil.getRefreshExpiration() / 1000, ChronoUnit.SECONDS))
                        .deviceInfo(deviceInfo)
                        .build()
        );

        return new TokenResponse(access, refresh);
    }

    private void sendEmailVerificationOtp(User user) {

        String otp = securityUtil.generateOtp(otpLength);

        emailVerificationService.save(
                EmailVerification.builder()
                        .user(user)
                        .otpHash(securityUtil.hashToken(otp))
                        .expiresAt(Instant.now().plus(otpExpiryMinutes, ChronoUnit.MINUTES))
                        .build()
        );

        emailService.sendOtpEmail(user.getEmail(), otp, "Verify Email");
    }

    private UserDetails toUserDetails(User user) {
        return new CustomUserDetails(
                user.getEmail(),
                user.getPasswordHash(),
                user.getIsActive() && user.getIsEmailVerified(),
                user.getRoles().stream()
                        .map(r -> new SimpleGrantedAuthority(r.getName()))
                        .collect(Collectors.toSet()),
                user.getTokenVersion()
        );
    }

    private OAuthAccount createOAuthUser(
            String provider,
            String providerUserId,
            Map<String, Object> profile) {

        String email = (String) profile.get("email");

        if (userService.existsByEmail(email)) {
            throw new UserAlreadyExistsException("Email already registered");
        }

        Role role = roleService.findByName("ROLE_USER")
                .orElseThrow();

        User user = User.builder()
                .email(email)
                .fullName((String) profile.get("name"))
                .isActive(true)
                .isEmailVerified(true)
                .roles(Set.of(role))
                .tokenVersion(UUID.randomUUID().toString())
                .build();

        userService.save(user);

        OAuthAccount account = OAuthAccount.builder()
                .user(user)
                .provider(provider)
                .providerUserId(providerUserId)
                .providerData(profile.toString())
                .build();

        return oAuthAccountService.save(account);
    }
}
