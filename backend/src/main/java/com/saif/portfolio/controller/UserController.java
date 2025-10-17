package com.saif.portfolio.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.saif.portfolio.dto.UserProfileDto;
import com.saif.portfolio.payload.ApiResponse;
import com.saif.portfolio.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // ✅ Get any user profile by ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserProfileDto>> getUserProfile(@PathVariable Long id) {
        UserProfileDto profile = userService.getUserProfile(id);
        return ResponseEntity.ok(new ApiResponse<>(200, "User profile fetched successfully", profile));
    }


    // ✅ Update current user profile
    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileDto>> updateCurrentUser(@RequestBody UserProfileDto updateRequest) {
        UserProfileDto currentUser = userService.getCurrentUserFromContext();
        UserProfileDto updated = userService.updateUserProfile(currentUser.getId(), updateRequest);
        return ResponseEntity.ok(new ApiResponse<>(200, "User profile updated successfully", updated));
    }
}
