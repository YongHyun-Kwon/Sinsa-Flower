package com.sinsaflower.payment.common.service;

import com.sinsaflower.payment.common.entity.DepositHookLog;
import com.sinsaflower.payment.common.repository.HookLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class HookLogService {
    private final HookLogRepository hookLogRepository;

    @Transactional
    public void saveHookLog(DepositHookLog log) {
        hookLogRepository.save(log);
    }
}
