package com.sinsaflower.repository;

import com.sinsaflower.domain.board.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    
    // 삭제되지 않은 게시글 목록 (최신순)
    List<Post> findByIsDeletedFalseOrderByCreatedAtDesc();
    
    // 특정 게시판의 게시글 목록
    List<Post> findByBoardIdAndIsDeletedFalseOrderByCreatedAtDesc(Long boardId);
    
    // 베스트 글 (댓글 수 기준)
    @Query("SELECT p FROM Post p WHERE p.isDeleted = false ORDER BY p.commentCount DESC")
    List<Post> findBestPostsByCommentCount();
    
    // 제목 또는 내용으로 검색
    @Query("SELECT p FROM Post p WHERE p.isDeleted = false AND (p.title LIKE %:keyword% OR p.content LIKE %:keyword%) ORDER BY p.createdAt DESC")
    List<Post> findByKeyword(@Param("keyword") String keyword);
} 