package com.saif.portfolio.exception;

import java.io.IOException;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.saif.portfolio.payload.ApiResponse;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class RestAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException, ServletException {

        response.setContentType("application/json");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        String message = (authException != null && authException.getMessage() != null)
                ? authException.getMessage()
                : "Authentication required";

        ApiResponse<Object> apiResponse = new ApiResponse<>(HttpServletResponse.SC_UNAUTHORIZED, message, null);
        mapper.writeValue(response.getOutputStream(), apiResponse);
    }
}
