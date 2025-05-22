package com.sinsaflower.repository;

import com.sinsaflower.domain.user.AccountInfo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountInfoRepository extends JpaRepository<AccountInfo, Long> {
} 