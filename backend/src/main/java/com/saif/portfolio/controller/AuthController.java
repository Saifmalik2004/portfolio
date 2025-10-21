package com.saif.portfolio.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.saif.portfolio.dto.ForgotPasswordRequest;
import com.saif.portfolio.dto.LoginRequest;
import com.saif.portfolio.dto.RegisterRequest;
import com.saif.portfolio.dto.ResendOtpRequest;
import com.saif.portfolio.dto.ResetPasswordRequest;
import com.saif.portfolio.dto.TokenResponse;
import com.saif.portfolio.dto.UserProfileDto;
import com.saif.portfolio.dto.VerifyEmailRequest;
import com.saif.portfolio.payload.ApiResponse;
import com.saif.portfolio.service.AuthService;
import com.saif.portfolio.service.UserService;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    // ✅ Environment-based flag (change to @Value if needed)
    private final boolean isProduction = false; // 👈 set false for localhost testing

    private ResponseCookie createRefreshCookie(String token, long maxAgeSeconds) {
        return ResponseCookie.from("refreshToken", token)
                .httpOnly(true)
                .secure(isProduction)
                .path("/")
                .maxAge(maxAgeSeconds)
                .sameSite(isProduction ? "None" : "Lax")
                .build();
    }

    // 🔹 Register
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Void>> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(201, "Registered successfully. Please verify your email.", null));
    }

    // 🔹 Verify Email
    @PostMapping("/verify-email")
    public ResponseEntity<ApiResponse<Void>> verifyEmail(@Valid @RequestBody VerifyEmailRequest request) {
        authService.verifyEmail(request);
        return ResponseEntity.ok(new ApiResponse<>(200, "Email verified successfully", null));
    }

    // 🔹 Resend Verification OTP
    @PostMapping("/resend-verify-otp")
    public ResponseEntity<ApiResponse<Void>> resendVerifyOtp(@Valid @RequestBody ResendOtpRequest request) {
        authService.resendEmailVerificationOtp(request.getEmail());
        return ResponseEntity.ok(new ApiResponse<>(200, "Verification OTP sent", null));
    }

    // ✅ Login
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<TokenResponse>> login(
            @Valid @RequestBody LoginRequest request,
            @RequestHeader(value = "X-Forwarded-For", required = false) String ip,
            HttpServletResponse response) {

        if (ip == null) ip = "unknown";

        TokenResponse tokenResponse = authService.login(request, ip);

        // ✅ Refresh token cookie
        ResponseCookie refreshCookie = createRefreshCookie(tokenResponse.getRefreshToken(), 7 * 24 * 60 * 60);
        response.addHeader("Set-Cookie", refreshCookie.toString());

        return ResponseEntity.ok(new ApiResponse<>(200, "Login successful", tokenResponse));
    }

    // 🔹 Refresh Token
    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<TokenResponse>> refreshToken(
            @CookieValue(value = "refreshToken", required = false) String refreshToken,
            HttpServletResponse response) {

        if (refreshToken == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(401, "Refresh token missing", null));
        }


        TokenResponse tokenResponse = authService.refreshToken(refreshToken);
        ResponseCookie refreshCookie = createRefreshCookie(tokenResponse.getRefreshToken(), 7 * 24 * 60 * 60);
        response.addHeader("Set-Cookie", refreshCookie.toString());

        return ResponseEntity.ok(new ApiResponse<>(200, "Token refreshed successfully", tokenResponse));
    }

    // 🔹 Logout
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(
            @CookieValue(name = "refreshToken", required = false) String refreshToken,
            HttpServletResponse response) {

        if (refreshToken != null) {
            authService.logout(refreshToken);
        }

        // ✅ Clear cookie (sameSite consistent)
        ResponseCookie clearCookie = createRefreshCookie("", 0);
        response.addHeader("Set-Cookie", clearCookie.toString());

        return ResponseEntity.ok(new ApiResponse<>(200, "Logout successful", null));
    }

    // 🔹 Logout from all other devices
    @PostMapping("/logout-all-other")
    public ResponseEntity<ApiResponse<Void>> logoutAllOther(
            @CookieValue(name = "refreshToken", required = false) String refreshToken) {

        if (refreshToken == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(401, "Refresh token missing", null));
        }

        authService.logoutAllOtherDevices(refreshToken);
        return ResponseEntity.ok(new ApiResponse<>(200, "Logged out from other devices successfully", null));
    }

    // 🔹 Forgot Password
    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request);
        return ResponseEntity.ok(new ApiResponse<>(200, "Password reset OTP sent to your email", null));
    }

    // 🔹 Reset Password
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(new ApiResponse<>(200, "Password reset successful", null));
    }

    // ✅ Current User
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileDto>> getCurrentUser() {
        UserProfileDto currentUser = userService.getCurrentUserFromContext();
        return ResponseEntity.ok(new ApiResponse<>(200, "Current user fetched successfully", currentUser));
    }

    // 🔹 Social Login
    @PostMapping("/social-login/{provider}")
    public ResponseEntity<ApiResponse<TokenResponse>> socialLogin(
            @PathVariable String provider,
            @RequestBody Map<String, Object> profile) {

        if (profile == null || !profile.containsKey("id")) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(400, "Invalid social login data", null));
        }

        String providerUserId = (String) profile.get("id");
        TokenResponse response = authService.socialLogin(provider, providerUserId, profile);
        return ResponseEntity.ok(new ApiResponse<>(200, "Social login successful", response));
    }
}
