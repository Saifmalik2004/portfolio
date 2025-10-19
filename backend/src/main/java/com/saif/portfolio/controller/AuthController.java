package com.saif.portfolio.controller;

import java.util.Map;

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

    // 🔹 Register user
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Void>> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.status(201)
                .body(new ApiResponse<>(201, "Registered successfully. Please verify your email.", null));
    }

    // 🔹 Verify Email
    @PostMapping("/verify-email")
    public ResponseEntity<ApiResponse<Void>> verifyEmail(@Valid @RequestBody VerifyEmailRequest request) {
        authService.verifyEmail(request);
        return ResponseEntity.ok(new ApiResponse<>(200, "Email verified successfully", null));
    }

    @PostMapping("/resend-verify-otp")
    public ResponseEntity<ApiResponse<Void>> resendVerifyOtp(@Valid @RequestBody ResendOtpRequest request) {
        authService.resendEmailVerificationOtp(request.getEmail());
        return ResponseEntity.ok(new ApiResponse<>(200, "verify your email", null));
    }

// ✅ Login
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<TokenResponse>> login(
            @Valid @RequestBody LoginRequest request,
            @RequestHeader(value = "X-Forwarded-For", required = false) String ip,
            HttpServletResponse response) {

        if (ip == null) {
            ip = "unknown";
        }

        // ✅ Auth service generates both tokens
        TokenResponse tokenResponse = authService.login(request, ip);

        // ✅ Only set REFRESH TOKEN in cookie (best practice)
        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", tokenResponse.getRefreshToken())
                .httpOnly(true) // ❌ Prevent JavaScript access
                .secure(true) // ✅ Required in production (HTTPS)
                .path("/api/auth/refresh-token") // 🎯 Restrict cookie access only to refresh endpoint
                .maxAge(7 * 24 * 60 * 60) // 7 days
                .sameSite("Strict") // ✅ Prevent CSRF from external sites
                .build();

        // ✅ Attach cookie
        response.addHeader("Set-Cookie", refreshCookie.toString());

        // ✅ Return accessToken + refreshToken ALSO in body if frontend wants to store manually
        return ResponseEntity.ok(new ApiResponse<>(200, "Login successful", tokenResponse));
    }

    // 🔹 Refresh token
    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<TokenResponse>> refreshToken(@CookieValue(value = "refreshToken", required = false) String refreshToken, HttpServletResponse servletResponse) {
        if (refreshToken == null) {
            return ResponseEntity.status(401)
                    .body(new ApiResponse<>(401, "Refresh token missing", null));
        }
        TokenResponse tokenResponse = authService.refreshToken(refreshToken);
        // ✅ Update cookies

        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", tokenResponse.getRefreshToken())
                .httpOnly(true)
                .secure(true)
                .path("/api/auth/refresh-token")
                .maxAge(7 * 24 * 60 * 60)
                .sameSite("Strict")
                .build();

        servletResponse.addHeader("Set-Cookie", refreshCookie.toString());
        return ResponseEntity.ok(new ApiResponse<>(200, "Token refreshed successfully", tokenResponse));
    }

    // 🔹 Logout
    @PostMapping("/logout")
public ResponseEntity<ApiResponse<Void>> logout(
        @CookieValue(name = "refreshToken", required = false) String refreshToken,
        HttpServletResponse servletResponse) {

    if (refreshToken != null) {
        authService.logout(refreshToken);
    }

    // Clear the cookie
    ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", "")
            .httpOnly(true)
            .secure(true)
            .path("/")
            .maxAge(0)
            .sameSite("Strict")
            .build();

    servletResponse.addHeader("Set-Cookie", refreshCookie.toString());

    return ResponseEntity.ok(new ApiResponse<>(200, "Logout successful", null));
}

    @PostMapping("/logout-all-other")
    public ResponseEntity<ApiResponse<Void>> logoutAll(@RequestBody Map<String, String> request, HttpServletResponse servletResponse) {
        String refreshToken = request.get("refreshToken");
        authService.logoutAllOtherDevices(refreshToken);
        return ResponseEntity.ok(new ApiResponse<>(200, "Logout from other devices successful", null));
    }

    // 🔹 Forgot password
    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request);
        return ResponseEntity.ok(new ApiResponse<>(200, "Password reset OTP sent to your email", null));
    }

    // 🔹 Reset password
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(new ApiResponse<>(200, "Password reset successful", null));
    }

    // ✅ Get current logged-in user
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileDto>> getCurrentUser() {
        UserProfileDto currentUser = userService.getCurrentUserFromContext();
        return ResponseEntity.ok(new ApiResponse<>(200, "Current user fetched successfully", currentUser));
    }

    // 🔹 Social login (Google, GitHub, etc.)
    @PostMapping("/social-login/{provider}")
    public ResponseEntity<ApiResponse<TokenResponse>> socialLogin(
            @PathVariable String provider,
            @RequestBody Map<String, Object> profile) {
        String providerUserId = (String) profile.get("id");
        TokenResponse response = authService.socialLogin(provider, providerUserId, profile);
        return ResponseEntity.ok(new ApiResponse<>(200, "Social login successful", response));
    }
}
