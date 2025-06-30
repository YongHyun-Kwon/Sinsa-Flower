package com.sinsaflower.point.service;

import com.sinsaflower.domain.user.User;
import com.sinsaflower.point.domain.PointLedger;
import com.sinsaflower.point.domain.SourceType;
import com.sinsaflower.point.repository.PointLedgerRepository;
import com.sinsaflower.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class PointLedgerService {
    private final PointLedgerRepository pointLedgerRepository;
    private final UserRepository userRepository;
    public static final String TOSS_VIRTUAL_ACCOUNT_DEPOSIT = "토스가상계좌입금";
    public static final String TOSS_VIRTUAL_ACCOUNT_DEPOSIT_CANCEL = "토스가상계좌입금취소";

    @Transactional
    public void done(String userId, Integer amount, String transactionId) {
        Optional<User> user = userRepository.findByUserId(userId);
        PointLedger ledger = PointLedger.earn(user.orElseGet(null), amount, TOSS_VIRTUAL_ACCOUNT_DEPOSIT, transactionId);
        ledger.setSourceType(SourceType.VIRTUAL_ACCOUNT);
        pointLedgerRepository.save(ledger);
    }

    @Transactional
    public void pointRollBack(String userId, Integer amount, String transactionId) {
        log.info("tID :: {}, type : {}", transactionId, PointLedger.Type.EARN);
        List<PointLedger> earnedLedgers = pointLedgerRepository.findByTransactionIdAndType(transactionId, PointLedger.Type.EARN);

        if (earnedLedgers.isEmpty()) {
            throw new IllegalStateException("No EARN point records found for transaction: " + transactionId);
        }

        for (PointLedger earned : earnedLedgers) {
            // 이미 롤백된 이력이 있는지 확인 (idempotency 보장)
            boolean alreadyRolledBack = pointLedgerRepository.existsByTransactionIdAndType(earned.getTransactionId(), PointLedger.Type.CANCEL);
            if (alreadyRolledBack) continue;
            Optional<User> user = userRepository.findByUserId(userId);
            PointLedger pointLedger = PointLedger.cancel(user.orElseThrow(), amount, TOSS_VIRTUAL_ACCOUNT_DEPOSIT_CANCEL, transactionId);
            pointLedgerRepository.save(pointLedger);
        }
    }

    @Transactional
    public boolean existsByTransactionKey(String transactionKey) {
        return pointLedgerRepository.existsByTransactionId(transactionKey);
    }
}
