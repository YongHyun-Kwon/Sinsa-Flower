package com.sinsaflower.repository;

import com.sinsaflower.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUserId(String userId);
    boolean existsByUserId(String userId);
    boolean existsByPhone(String phone);
    List<User> findByStatus(User.UserStatus status);
} 