package com.sinsaflower.domain.category;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "category")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long categoryId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parentCategoryId")
    private Category parentCategory;

    @Column(nullable = false, length = 100)
    private String categoryName;

    @Column(length = 50)
    private String categoryCode;

    @Column(length = 255)
    private String categoryDescription;

    @Column(length = 255)
    private String categoryImageUrl;

    @Column
    private Integer displayOrder;

    @Column(nullable = false)
    private Boolean isActive = true;

    @Column(nullable = false)
    private Integer depth = 0;

    @Column(nullable = false)
    private Boolean visibleInB2B = true;

    @Column(nullable = false)
    private Boolean visibleInB2C = false;

    @Column(length = 100)
    private String slug;

    @Column(length = 100)
    private String localeGroupId;

    // 공통 필드
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;
} 