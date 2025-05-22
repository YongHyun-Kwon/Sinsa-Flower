package com.sinsaflower.repository;

import com.sinsaflower.domain.user.BusinessInfo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BusinessInfoRepository extends JpaRepository<BusinessInfo, Long> {
} 