package com.sinsaflower.payment.toss.repository;

import com.sinsaflower.payment.toss.domain.DepositHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DepositHistoryRepository extends JpaRepository<DepositHistory, Long> {
    boolean existsByTransactionKey(String transactionKey);
}
