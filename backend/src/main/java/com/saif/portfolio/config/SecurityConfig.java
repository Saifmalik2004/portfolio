package com.saif.portfolio.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import com.saif.portfolio.repository.PersonRepository;
import com.saif.portfolio.security.CustomAuthenticationEntryPoint;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService(PersonRepository personRepository) {
        return username -> personRepository.findByUsername(username)
                .map(person -> User.withUsername(person.getUsername())
                        .password(person.getPassword())
                        .roles(person.getRole().toString())
                        .build())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, CustomAuthenticationEntryPoint customEntryPoint) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                // Allow all GET requests without auth
                .requestMatchers(HttpMethod.GET, "/**").permitAll()

                // Allow anyone to register/login (POST on /api/auth/**)
                .requestMatchers(HttpMethod.POST, "/api/auth/**").permitAll()

                // All other requests (POST/PUT/DELETE etc) require authentication
                .anyRequest().authenticated()
            )
            // Enable HTTP Basic Auth
            .httpBasic(httpBasic -> httpBasic.authenticationEntryPoint(customEntryPoint))
            .csrf(csrf -> csrf.disable());

        return http.build();
    }
}
