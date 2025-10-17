package com.saif.portfolio.service;

import java.util.Map;

import com.saif.portfolio.dto.ForgotPasswordRequest;
import com.saif.portfolio.dto.LoginRequest;
import com.saif.portfolio.dto.RegisterRequest;
import com.saif.portfolio.dto.ResetPasswordRequest;
import com.saif.portfolio.dto.TokenResponse;
import com.saif.portfolio.dto.VerifyEmailRequest;

public interface AuthService {
    void register(RegisterRequest request);
    void verifyEmail(VerifyEmailRequest request);
    void resendEmailVerificationOtp(String email);
    TokenResponse login(LoginRequest request, String ip);
    TokenResponse refreshToken(String refreshToken);
    void forgotPassword(ForgotPasswordRequest request);
    void resetPassword(ResetPasswordRequest request);
    void logout(String refreshToken);
    void logoutAllOtherDevices(String currentRefreshToken);
    TokenResponse socialLogin(String provider, String providerUserId, Map<String, Object> profile);
}