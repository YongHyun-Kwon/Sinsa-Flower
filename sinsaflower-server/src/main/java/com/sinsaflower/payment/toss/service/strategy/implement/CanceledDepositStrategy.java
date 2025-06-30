package com.sinsaflower.payment.toss.service.strategy.implement;

import com.sinsaflower.payment.toss.domain.VirtualAccount;
import com.sinsaflower.payment.toss.dto.TossDepositCallbackWebhookDto;
import com.sinsaflower.payment.toss.repository.VirtualAccountRepository;
import com.sinsaflower.point.service.PointLedgerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component("CANCELED")
@RequiredArgsConstructor
@Slf4j
public class CanceledDepositStrategy implements DepositStatusStrategy {
    private final PointLedgerService pointLedgerService;
    private final VirtualAccountRepository virtualAccountRepository;

    @Override
    public void handle(TossDepositCallbackWebhookDto webhookDto, VirtualAccount virtualAccount) {
        log.info("in cancel login");
        pointLedgerService.pointRollBack(virtualAccount.getUserId(), virtualAccount.getTotalAmount(),webhookDto.getTransactionKey());
        virtualAccount.setStatus("CANCELED");
        virtualAccountRepository.save(virtualAccount);
    }

    @Override
    public String getKey() {
        return "CANCELED";
    }
}
