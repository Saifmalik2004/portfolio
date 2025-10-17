package com.saif.portfolio.exception;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import com.saif.portfolio.payload.ApiResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // ✅ Reusable response builder
    private ResponseEntity<ApiResponse<Object>> buildResponse(HttpStatus status, String message, Object data) {
        return ResponseEntity.status(status)
                .body(new ApiResponse<>(status.value(), message, data));
    }

    // ✅ 1. Handle malformed or missing request body
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse<Object>> handleHttpMessageNotReadable(HttpMessageNotReadableException ex) {
        log.warn("Malformed JSON request: {}", ex.getMessage());
        return buildResponse(HttpStatus.BAD_REQUEST, "Invalid or malformed JSON in request body", null);
    }

    // ✅ 2. Handle ResourceNotFoundException
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleResourceNotFound(ResourceNotFoundException ex) {
        log.info("Resource not found: {}", ex.getMessage());
        return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage(), null);
    }

    // ✅ 3. Handle validation errors
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> validationErrors = new HashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(error -> validationErrors.put(error.getField(), error.getDefaultMessage()));
        log.warn("Validation failed: {}", validationErrors);
        return buildResponse(HttpStatus.BAD_REQUEST, "Validation failed", validationErrors);
    }

    // ✅ 4. Handle unauthorized access (Forbidden)
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Object>> handleAccessDenied(AccessDeniedException ex) {
        log.warn("Access denied: {}", ex.getMessage());
        return buildResponse(HttpStatus.FORBIDDEN, "Access denied", null);
    }

    // ✅ 5. Handle authentication errors (invalid credentials, etc.)
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiResponse<Object>> handleAuthenticationException(AuthenticationException ex) {
        log.warn("Authentication failed: {}", ex.getMessage());
        return buildResponse(HttpStatus.UNAUTHORIZED, "Authentication failed: " + ex.getMessage(), null);
    }

    // ✅ 6. Handle custom exceptions
    @ExceptionHandler({
            UserAlreadyExistsException.class,
            InvalidOtpException.class,
            EmailAlreadyVerifyException.class,
            InvalidTokenException.class
    })
    public ResponseEntity<ApiResponse<Object>> handleBadRequestExceptions(RuntimeException ex) {
        log.warn("Bad request: {}", ex.getMessage());
        return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage(), null);
    }

    // ✅ 7. Handle account locked or verification-related exceptions
    @ExceptionHandler({
            AccountLockedException.class,
            VerifyEmailException.class
    })
    public ResponseEntity<ApiResponse<Object>> handleForbiddenExceptions(RuntimeException ex) {
        log.warn("Forbidden action: {}", ex.getMessage());
        return buildResponse(HttpStatus.FORBIDDEN, ex.getMessage(), null);
    }

    // ✅ 8. Handle OTP expired
    @ExceptionHandler(OtpExpiredException.class)
    public ResponseEntity<ApiResponse<Object>> handleOtpExpired(OtpExpiredException ex) {
        log.warn("OTP expired: {}", ex.getMessage());
        return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage(), null);
    }

    // ✅ 9. Handle JWT-related exceptions
    @ExceptionHandler({
            JwtTokenExpiredException.class,
            JwtTokenInvalidException.class
    })
    public ResponseEntity<ApiResponse<Object>> handleJwtExceptions(RuntimeException ex) {
        log.warn("JWT error: {}", ex.getMessage());
        return buildResponse(HttpStatus.UNAUTHORIZED, ex.getMessage(), null);
    }

    // ✅ 10. Handle rate limiting
    @ExceptionHandler(TooManyRequestsException.class)
    public ResponseEntity<ApiResponse<Object>> handleTooManyRequests(TooManyRequestsException ex) {
        log.warn("Too many requests: {}", ex.getMessage());
        return buildResponse(HttpStatus.TOO_MANY_REQUESTS, ex.getMessage(), null);
    }

    // ✅ 11. Handle invalid credentials (custom exception)
    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ApiResponse<Object>> handleInvalidCredentials(InvalidCredentialsException ex) {
        log.warn("Invalid credentials: {}", ex.getMessage());
        return buildResponse(HttpStatus.UNAUTHORIZED, ex.getMessage(), null);
    }

    // ✅ 12. Handle all unhandled exceptions (fallback)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleGlobalException(Exception ex, WebRequest request) {
        log.error("Unexpected error occurred: {}", ex.getMessage(), ex);
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Something went wrong", ex.getMessage());
    }
}
