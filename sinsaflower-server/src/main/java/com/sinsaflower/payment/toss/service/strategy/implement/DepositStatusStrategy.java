package com.sinsaflower.payment.toss.service.strategy.implement;

import com.sinsaflower.payment.toss.domain.VirtualAccount;
import com.sinsaflower.payment.toss.dto.TossDepositCallbackWebhookDto;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

public interface DepositStatusStrategy {
    String getKey();
    @Transactional
    void handle(TossDepositCallbackWebhookDto webhookDto, VirtualAccount virtualAccount);
}
