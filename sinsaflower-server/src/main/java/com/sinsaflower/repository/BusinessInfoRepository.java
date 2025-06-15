package com.sinsaflower.repository;

import com.sinsaflower.domain.user.BusinessInfo;
import com.sinsaflower.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BusinessInfoRepository extends JpaRepository<BusinessInfo, Long> {
    Optional<BusinessInfo> findByUser(User user);
} 