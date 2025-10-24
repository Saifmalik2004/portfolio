package com.saif.portfolio.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.saif.portfolio.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);
    Optional<User> findByUsername(String username);

    @Query("SELECT COUNT(c) FROM User c WHERE c.isEmailVerified = true")
    long countVerifyUser();
    
    @Query("SELECT COUNT(c) FROM User c")
    long countAllRegisterUser();


}
