package com.sinsaflower.point.domain;

import com.sinsaflower.domain.user.User;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
@Data
@Entity
@Table(uniqueConstraints = @UniqueConstraint(columnNames = {"transactionId", "type"}))
public class PointLedger {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    private String transactionId;

    private int amount;

    @Enumerated(EnumType.STRING)
    private Type type;

    @Enumerated(EnumType.STRING)
    private SourceType sourceType;

    private String memo;

    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Type {
        EARN, USE, CANCEL, EXPIRE
    }

    public static PointLedger earn(User user, Integer amount, String memo, String transactionId) {
        PointLedger ledger = new PointLedger();
        ledger.user = user;
        ledger.amount = amount;
        ledger.type = Type.EARN;
        ledger.memo = memo;
        ledger.transactionId = transactionId;
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

    public static PointLedger refund(User user, int amount, String memo) {
        PointLedger ledger = new PointLedger();
        ledger.user = user;
        ledger.amount = -amount;
        ledger.type = Type.CANCEL;
        ledger.memo = memo;
        return ledger;
    }


    public static PointLedger cancel(User user, int amount, String memo, String transactionId) {
        PointLedger ledger = new PointLedger();
        ledger.user = user;
        ledger.amount = -amount;
        ledger.type = Type.CANCEL;
        ledger.memo = memo;
        ledger.transactionId = transactionId;
        return ledger;
    }
}
