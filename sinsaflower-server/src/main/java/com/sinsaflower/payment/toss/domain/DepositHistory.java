package com.sinsaflower.payment.toss.domain;

import com.sinsaflower.payment.toss.dto.DepositHistoryStatus;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Data;

import java.time.LocalDateTime;
@Data
@Entity
public class DepositHistory {
    @Id
    @GeneratedValue
    private Long id;

    private String transactionKey; // Toss에서 받은 고유 거래키
    private String orderId;        // 대응되는 주문 번호

    private Integer amount;
    private LocalDateTime depositedAt;
    private DepositHistoryStatus status;
}
