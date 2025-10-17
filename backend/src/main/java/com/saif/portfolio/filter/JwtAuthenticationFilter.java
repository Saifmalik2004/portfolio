package com.saif.portfolio.filter;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.saif.portfolio.config.CustomUserDetails;
import com.saif.portfolio.payload.ApiResponse;
import com.saif.portfolio.util.JwtUtil;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        try {
            String jwt = null;

            // 1️⃣ Check Authorization header
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                jwt = authHeader.substring(7);
            }

            // 3️⃣ Validate token
            if (jwt != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                String username = jwtUtil.extractUsername(jwt);
                if (username != null) {
                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                    if (userDetails instanceof CustomUserDetails customUser) {
                        try {
                            jwtUtil.validateToken(jwt, customUser, customUser.getTokenVersion()); // ✅ throws exception if invalid
                            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                    customUser, null, customUser.getAuthorities());
                            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                            SecurityContextHolder.getContext().setAuthentication(authToken);
                        } catch (JwtException e) {
                            throw e; // Filter will handle this in catch block
                        }
                    }
                }
            }

            filterChain.doFilter(request, response);

        } catch (io.jsonwebtoken.ExpiredJwtException e) {
            sendErrorResponse(response, "Access token expired", HttpServletResponse.SC_UNAUTHORIZED);
        } catch (io.jsonwebtoken.JwtException e) {
            switch (e.getMessage()) {
                case "TOKEN_VERSION_MISMATCH":
                    sendErrorResponse(response, "Session expired due to security changes. Please login again.", HttpServletResponse.SC_UNAUTHORIZED);
                    break;
                case "USERNAME_MISMATCH":
                    sendErrorResponse(response, "Invalid token user", HttpServletResponse.SC_UNAUTHORIZED);
                    break;
                default:
                    sendErrorResponse(response, "Invalid JWT token", HttpServletResponse.SC_UNAUTHORIZED);
                    break;

            }
        }

    }

    private void sendErrorResponse(HttpServletResponse response, String message, int status) throws IOException {
        response.setContentType("application/json");
        response.setStatus(status);
        ApiResponse<Object> apiResponse = new ApiResponse<>(status, message, null);
        new ObjectMapper().writeValue(response.getOutputStream(), apiResponse);
    }

}
