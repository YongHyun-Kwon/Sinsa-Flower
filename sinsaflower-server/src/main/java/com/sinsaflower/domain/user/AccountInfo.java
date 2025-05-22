package com.sinsaflower.domain.user;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "account_info")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AccountInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // id

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // user_id

    @Column(length = 40)
    private String accountNumber; // account_number

    @Column(length = 40)
    private String virtualAccount; // virtual_account

    @Column(length = 255)
    private String bankAccountCopy; // bank_account_copy

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt; // created_at

    @Column(nullable = false)
    private LocalDateTime updatedAt; // updated_at
} 