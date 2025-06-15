package com.sinsaflower.repository;

import com.sinsaflower.domain.board.Notice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NoticeRepository extends JpaRepository<Notice, Long> {
    
    // 활성 공지사항 목록 (고정 공지 우선, 생성일 내림차순)
    List<Notice> findByIsActiveTrueOrderByIsPinnedDescCreatedAtDesc();
    
    // 현재 시간 기준 유효한 공지사항
    @Query("SELECT n FROM Notice n WHERE n.isActive = true AND " +
           "(n.visibleFrom IS NULL OR n.visibleFrom <= :now) AND " +
           "(n.visibleTo IS NULL OR n.visibleTo >= :now) " +
           "ORDER BY n.isPinned DESC, n.createdAt DESC")
    List<Notice> findValidNotices(LocalDateTime now);
    
    // 고정 공지사항만 조회
    List<Notice> findByIsActiveTrueAndIsPinnedTrueOrderByCreatedAtDesc();
} 