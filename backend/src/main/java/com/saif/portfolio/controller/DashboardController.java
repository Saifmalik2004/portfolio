package com.saif.portfolio.controller;


import com.saif.portfolio.dto.ApiResponse;
import com.saif.portfolio.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String,Long>>> getDashboardState() {
        Map<String,Long> responses = dashboardService.getDashboardStats();
        return ResponseEntity.ok(new ApiResponse<>(200, "Dashboard data fetched successfully", responses));
    }
}
