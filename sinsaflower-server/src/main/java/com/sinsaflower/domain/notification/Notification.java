package com.sinsaflower.domain.notification;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import com.sinsaflower.domain.user.User;

@Entity
@Table(name = "notification")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // id

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // user_id

    @Column(length = 100)
    private String title; // title

    @Column(length = 500)
    private String content; // content

    @Column(length = 30)
    private String type; // type

    @Column(nullable = false)
    private Boolean isRead = false; // is_read

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt; // created_at

    @Column(nullable = false)
    private LocalDateTime updatedAt; // updated_at
} 