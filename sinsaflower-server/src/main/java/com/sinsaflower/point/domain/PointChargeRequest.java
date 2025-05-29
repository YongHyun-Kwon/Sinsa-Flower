package com.sinsaflower.point.domain;

import com.sinsaflower.domain.user.User;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
@Data
@Entity
public class PointChargeRequest {
    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    private int requestedAmount;

    private String bankName;
    private String accountNumber;
    private String depositorName;

    @Enumerated(EnumType.STRING)
    private RequestStatus status = RequestStatus.PENDING;

    private LocalDateTime requestedAt = LocalDateTime.now();
    private LocalDateTime confirmedAt;


    public enum RequestStatus {
        PENDING, CONFIRMED, REJECTED
    }

    public void confirm() {
        this.status = RequestStatus.CONFIRMED;
        this.confirmedAt = LocalDateTime.now();
    }

    public void reject() {
        this.status = RequestStatus.REJECTED;
    }
}
