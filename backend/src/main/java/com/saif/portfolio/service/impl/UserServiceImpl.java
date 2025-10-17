package com.saif.portfolio.service.impl;

import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.saif.portfolio.dto.UserProfileDto;
import com.saif.portfolio.model.Role;
import com.saif.portfolio.model.User;
import com.saif.portfolio.repository.UserRepository;
import com.saif.portfolio.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    
    private final UserRepository userRepository;

    @Override
    @Transactional
    public User save(User user) {
        if (user.getEmail() == null || user.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email cannot be empty");
        }
        return userRepository.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    @Transactional(readOnly = true)
    public Boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfileDto getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return UserProfileDto.builder()
            .id(user.getId())
            .email(user.getEmail())
            .username(user.getUsername())
            .fullName(user.getFullName())
            .roles(user.getRoles().stream().map(Role::getName).collect(Collectors.toList()))
            .isEmailVerified(user.getIsEmailVerified())
            .isActive(user.getIsActive())
            .build();
    }

    @Override
    @Transactional
    public UserProfileDto updateUserProfile(Long userId, UserProfileDto updateRequest) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setFullName(updateRequest.getFullName());
        user.setUsername(updateRequest.getUsername());
        userRepository.save(user);
        updateRequest.setId(user.getId());
        updateRequest.setEmail(user.getEmail());
        return updateRequest;
    }
    
    @Override
    @Transactional(readOnly = true)
    public UserProfileDto getCurrentUserFromContext() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth == null || !(auth.getPrincipal() instanceof UserDetails)) {
        throw new RuntimeException("User not authenticated");
    }

    UserDetails userDetails = (UserDetails) auth.getPrincipal();
    User user = userRepository.findByEmail(userDetails.getUsername())
            .orElseThrow(() -> new RuntimeException("User not found"));

    return UserProfileDto.builder()
            .id(user.getId())
            .email(user.getEmail())
            .username(user.getUsername())
            .fullName(user.getFullName())
            .roles(user.getRoles().stream().map(Role::getName).collect(Collectors.toList()))
            .isEmailVerified(user.getIsEmailVerified())
            .isActive(user.getIsActive())
            .build();
}

}