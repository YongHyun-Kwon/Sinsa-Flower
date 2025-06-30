package com.sinsaflower.point.controller;

import com.sinsaflower.domain.user.User;
import com.sinsaflower.point.dto.PointLedgerDto;
import com.sinsaflower.point.service.PointUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/user/point")
@RequiredArgsConstructor
public class PointUserController {
    private final PointUserService pointUserService;

    /**
     * 사용자 사용 가능한 포인트 조회
     * @param user
     * @return
     */
    @GetMapping("/balance")
    public int getBalance(@AuthenticationPrincipal User user) {
        return pointUserService.getAvailablePoint(user);
    }

    /**
     * 사용자 포인트 조회 내역
     * @param user
     * @return
     */
    @GetMapping("/history")
    public List<PointLedgerDto> getHistory(@AuthenticationPrincipal User user) {
        return pointUserService.getHistory(user);
    }

    //@TODO 사용, 취소
}
