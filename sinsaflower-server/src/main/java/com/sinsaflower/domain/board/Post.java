package com.sinsaflower.domain.board;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "posts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "post_id")
    private Long postId;

    @Column(name = "user_id", nullable = false)
    private Long userId; // 작성자 ID

    @Column(name = "board_id", nullable = false)
    private Long boardId; // 게시판 ID

    @Column(name = "title", length = 255, nullable = false)
    private String title; // 제목

    @Column(name = "content", columnDefinition = "TEXT", nullable = false)
    private String content; // 내용

    @Column(name = "image_url", length = 255)
    private String imageUrl; // 이미지 URL

    @Column(name = "comment_count")
    @Builder.Default
    private Integer commentCount = 0; // 댓글 수

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt; // 생성일

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt; // 수정일

    @Column(name = "is_deleted")
    @Builder.Default
    private Boolean isDeleted = false; // 삭제 여부

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