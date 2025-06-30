package com.sinsaflower.payment.common.repository;

import com.sinsaflower.payment.common.entity.DepositHookLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HookLogRepository extends JpaRepository<DepositHookLog, Long> {
}
