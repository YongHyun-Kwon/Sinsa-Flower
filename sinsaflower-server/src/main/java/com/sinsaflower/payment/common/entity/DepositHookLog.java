package com.sinsaflower.payment.common.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
public class DepositHookLog {

    @Id
    @GeneratedValue
    private Long id;

    private String eventType; // 예: virtual-account.deposit.received

    private String orderId;
    private String transactionKey;
    private String status; // SUCCESS, FAILURE

    @Column(columnDefinition = "TEXT")
    private String requestBody; // raw JSON 저장

    @Column(columnDefinition = "TEXT")
    private String errorMessage;

    private LocalDateTime receivedAt = LocalDateTime.now();
}
