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
import com.saif.portfolio.dto.ApiResponse;
import com.saif.portfolio.util.JwtUtil;

import io.jsonwebtoken.ExpiredJwtException;
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
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain) throws ServletException, IOException {

        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {

                String jwt = authHeader.substring(7);

                if (SecurityContextHolder.getContext().getAuthentication() == null) {

                    String username = jwtUtil.extractUsernameSafely(jwt);

                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                    if (userDetails instanceof CustomUserDetails customUser) {
                        jwtUtil.validateToken(jwt, customUser, customUser.getTokenVersion());

                        UsernamePasswordAuthenticationToken auth =
                                new UsernamePasswordAuthenticationToken(
                                        customUser, null, customUser.getAuthorities());

                        auth.setDetails(
                                new WebAuthenticationDetailsSource().buildDetails(request));

                        SecurityContextHolder.getContext().setAuthentication(auth);
                    }
                }
            }

            chain.doFilter(request, response);

        } catch (ExpiredJwtException e) {
            send(response, 401, "Access token expired");
        } catch (JwtException e) {
            String msg = switch (e.getMessage()) {
                case "TOKEN_VERSION_MISMATCH" -> "Session expired, login again";
                case "USERNAME_MISMATCH" -> "Invalid token user";
                default -> "Invalid JWT token";
            };
            send(response, 401, msg);
            return;
        }
    }

    private void send(HttpServletResponse response, int status, String msg) throws IOException {
        response.setStatus(status);
        response.setContentType("application/json");
        new ObjectMapper().writeValue(
                response.getOutputStream(),
                new ApiResponse<>(status, msg, null)
        );
    }
}
