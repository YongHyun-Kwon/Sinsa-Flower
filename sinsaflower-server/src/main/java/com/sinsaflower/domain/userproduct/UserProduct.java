package com.sinsaflower.domain.userproduct;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_product")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProduct {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userProductId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId")
    private com.sinsaflower.domain.user.User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "productId")
    private com.sinsaflower.domain.product.Product product;

    @Column(nullable = false)
    private Integer price;

    @Column(nullable = false)
    private Boolean isActive = true;

    // 공통 필드
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;
} 