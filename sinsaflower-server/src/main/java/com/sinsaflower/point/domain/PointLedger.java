package com.sinsaflower.point.domain;

import com.sinsaflower.domain.user.User;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
@Data
@Entity
public class PointLedger {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    private PointChargeRequest pointChargeRequest;

    private int amount;

    @Enumerated(EnumType.STRING)
    private Type type;

    @Enumerated(EnumType.STRING)
    private SourceType sourceType;

    private String memo;

    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Type {
        CHARGE, REFUND, USE
    }

    public static PointLedger charge(User user, int amount, String memo) {
        PointLedger ledger = new PointLedger();
        ledger.user = user;
        ledger.amount = amount;
        ledger.type = Type.CHARGE;
        ledger.memo = memo;
        return ledger;
    }

    public static PointLedger use(User user, int amount, String memo) {
        PointLedger ledger = new PointLedger();
        ledger.user = user;
        ledger.amount = -amount;
        ledger.type = Type.USE;
        ledger.memo = memo;
        return ledger;
    }
}
