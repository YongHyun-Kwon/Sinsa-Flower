package com.sinsaflower.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardInfoDto {
    
    // 사용자 기본 정보
    private String userName; // 사용자명
    private BigDecimal balance; // 잔금총액
    private Integer sinsaPoints; // 신사 포인트
    private Integer gradePoints; // 등급 포인트
    
    // 주문 관리 정보
    private Long unconfirmedOrderCount; // 미확인 수주 건수
    
    // 베스트 글 목록
    private List<BestPostDto> bestPosts;
    
    // 부재중 설정 (추후 추가 가능)
    private Boolean isAbsent;
    
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BestPostDto {
        private Long postId;
        private String title;
        private String createdDate;
        private Integer commentCount;
    }
} 