package com.sinsaflower.domain.board;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "notices")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notice_id")
    private Long noticeId;

    @Column(name = "title", length = 255, nullable = false)
    private String title; // 제목

    @Column(name = "content", columnDefinition = "TEXT", nullable = false)
    private String content; // 내용

    @Column(name = "author_id", nullable = false)
    private Long authorId; // 작성자 ID

    @Column(name = "is_pinned")
    @Builder.Default
    private Boolean isPinned = false; // 상단 고정 여부

    @Column(name = "visible_from")
    private LocalDateTime visibleFrom; // 공지 시작 시간

    @Column(name = "visible_to")
    private LocalDateTime visibleTo; // 공지 종료 시간

    @Column(name = "view_count")
    @Builder.Default
    private Integer viewCount = 0; // 조회 수

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true; // 활성 여부

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt; // 생성일

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt; // 수정일

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