package com.saif.portfolio.service.impl;

import com.saif.portfolio.model.Role;
import com.saif.portfolio.repository.RoleRepository;
import com.saif.portfolio.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;

    @Override
    @Transactional(readOnly = true)
    @Cacheable("roles")
    public Optional<Role> findByName(String name) {
        return roleRepository.findByName(name);
    }

    @Override
    @Transactional
    public Role save(Role role) {
        if (role.getName() == null || role.getName().isBlank()) {
            throw new IllegalArgumentException("Role name cannot be empty");
        }
        if (!role.getName().startsWith("ROLE_")) {
            throw new IllegalArgumentException("Role name must start with 'ROLE_'");
        }
        return roleRepository.save(role);
    }
}