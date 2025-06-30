package com.sinsaflower.domain.settlement;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "settlement")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Settlement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "settlement_id")
    private Long settlementId;

    @Column(name = "user_id", nullable = false)
    private Long userId; // 사용자 ID

    @Column(name = "period", length = 20)
    private String period; // 정산 기간 (YYYY-MM 형식)

    @Column(name = "total_order_amount")
    private Integer totalOrderAmount; // 총 발주 금액

    @Column(name = "total_received_amount")
    private Integer totalReceivedAmount; // 총 수주 금액

    @Column(name = "net_balance")
    private Integer netBalance; // 잔액

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private SettlementStatus status = SettlementStatus.REQUESTED; // 정산 상태

    @Column(name = "settled_at")
    private LocalDateTime settledAt; // 정산 처리 시간

    @Column(name = "is_tracking_processed")
    @Builder.Default
    private Boolean isTrackingProcessed = false; // 추적 처리 여부

    @Column(name = "is_receipt_issued")
    @Builder.Default
    private Boolean isReceiptIssued = false; // 영수증 발행 여부

    @Column(name = "memo", columnDefinition = "TEXT")
    private String memo; // 메모

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt; // 생성일

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt; // 수정일

    public enum SettlementStatus {
        REQUESTED, PROCESSING, COMPLETED
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
} 