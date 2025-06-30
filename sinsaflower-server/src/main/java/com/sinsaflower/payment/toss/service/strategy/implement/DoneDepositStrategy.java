package com.sinsaflower.payment.toss.service.strategy.implement;

import com.sinsaflower.payment.toss.domain.VirtualAccount;
import com.sinsaflower.payment.toss.dto.TossDepositCallbackWebhookDto;
import com.sinsaflower.payment.toss.repository.VirtualAccountRepository;
import com.sinsaflower.point.service.PointLedgerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Component("DONE")
@Slf4j
public class DoneDepositStrategy implements DepositStatusStrategy{
    private final PointLedgerService pointLedgerService;
    private final VirtualAccountRepository virtualAccountRepository;
    @Override
    public void handle(TossDepositCallbackWebhookDto webhookDto, VirtualAccount virtualAccount) {
        String transactionKey = webhookDto.getTransactionKey();
        if (pointLedgerService.existsByTransactionKey(transactionKey)) {
            log.warn("[결제 완료] 이미 처리된 트랜잭션 아이디입니다 :: {}", transactionKey);
            return;
        }
        pointLedgerService.done(virtualAccount.getUserId(), virtualAccount.getTotalAmount(), transactionKey);
        virtualAccount.setStatus("DONE");
        virtualAccountRepository.save(virtualAccount);

    }

    @Override
    public String getKey() {
        return "DONE";
    }


}
