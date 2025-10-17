package com.saif.portfolio.service;

import java.util.Optional;

import com.saif.portfolio.dto.UserProfileDto;
import com.saif.portfolio.model.User;

public interface UserService {
    User save(User user);
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    Boolean existsByEmail(String email);
    Optional<User> findById(Long id);
    UserProfileDto getUserProfile(Long userId);
    UserProfileDto updateUserProfile(Long userId, UserProfileDto updateRequest);

    public UserProfileDto getCurrentUserFromContext();
}