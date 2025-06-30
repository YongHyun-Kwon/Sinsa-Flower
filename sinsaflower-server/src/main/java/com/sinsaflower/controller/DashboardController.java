package com.sinsaflower.controller;

import com.sinsaflower.dto.DashboardInfoDto;
import com.sinsaflower.service.DashboardService;
import com.sinsaflower.domain.user.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;
    
    /**
     * 사용자 대시보드 정보 조회
     */
    @GetMapping("/info")
    public ResponseEntity<DashboardInfoDto> getDashboardInfo() {
        
        try {
            // 현재 로그인한 사용자 정보 가져오기
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            
            if (authentication == null || "anonymousUser".equals(authentication.getName())) {
                return ResponseEntity.status(401).build();
            }
            
            // UserDetails에서 User 객체 가져오기
            Object principal = authentication.getPrincipal();
            if (!(principal instanceof User)) {
                log.error("Principal이 User 타입이 아닙니다: {}", principal.getClass().getSimpleName());
                return ResponseEntity.badRequest().build();
            }
            
            User user = (User) principal;
            Long userId = user.getId(); // PK 사용
            
            DashboardInfoDto dashboardInfo = dashboardService.getDashboardInfo(userId);
            return ResponseEntity.ok(dashboardInfo);
            
        } catch (Exception e) {
            log.error("대시보드 정보 조회 중 오류 발생", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 미확인 수주 건수만 조회
     */
    @GetMapping("/unconfirmed-orders/count")
    public ResponseEntity<Long> getUnconfirmedOrderCount() {
        
        try {
            // 현재 로그인한 사용자 정보 가져오기
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            
            if (authentication == null || "anonymousUser".equals(authentication.getName())) {
                return ResponseEntity.status(401).build();
            }
            
            // UserDetails에서 User 객체 가져오기
            Object principal = authentication.getPrincipal();
            if (!(principal instanceof User)) {
                log.error("Principal이 User 타입이 아닙니다: {}", principal.getClass().getSimpleName());
                return ResponseEntity.badRequest().build();
            }
            
            User user = (User) principal;
            Long userId = user.getId(); // PK 사용
            
            Long count = dashboardService.getUnconfirmedOrderCount(userId);
            return ResponseEntity.ok(count);
            
        } catch (Exception e) {
            log.error("미확인 수주 건수 조회 중 오류 발생", e);
            return ResponseEntity.ok(0L); // 건수 조회는 실패해도 0 반환
        }
    }
} 