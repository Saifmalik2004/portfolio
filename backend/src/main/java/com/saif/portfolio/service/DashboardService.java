package com.saif.portfolio.service;

import java.util.Map;

public interface DashboardService {
    Map<String,Long> getDashboardStats();
    void clearDashboardCache();
}
