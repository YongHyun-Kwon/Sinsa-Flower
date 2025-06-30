package com.sinsaflower.payment.toss.service.strategy.processor;

import com.sinsaflower.payment.toss.domain.VirtualAccount;
import com.sinsaflower.payment.toss.dto.TossDepositCallbackWebhookDto;
import com.sinsaflower.payment.toss.service.strategy.resolver.DepositStatusStrategyResolver;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DepositWebhookProcessor {
    private final DepositStatusStrategyResolver resolver;

    public void handle(TossDepositCallbackWebhookDto webhookDto, VirtualAccount virtualAccount) {
        resolver.resolve(webhookDto.getStatus()).handle(webhookDto, virtualAccount);
    }
}
