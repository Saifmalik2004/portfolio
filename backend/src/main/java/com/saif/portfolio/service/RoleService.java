package com.saif.portfolio.service;

import java.util.Optional;

import com.saif.portfolio.model.Role;

public interface RoleService {
    Optional<Role> findByName(String name);
    Role save(Role role);
}
