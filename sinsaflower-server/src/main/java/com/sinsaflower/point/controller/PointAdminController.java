package com.sinsaflower.point.controller;

import com.sinsaflower.point.dto.ChargeRequestDto;
import com.sinsaflower.point.service.PointAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/point")
@RequiredArgsConstructor
public class PointAdminController {
    private final PointAdminService pointAdminService;

    /**
     * 관리자 페이지에서  충전 요청 목록을 상태별로 필터링해서 조회
     * @param status
     * @return
     */
    @GetMapping
    public List<ChargeRequestDto> getByStatus(@RequestParam("status") String status) {
        return pointAdminService.getByStatus(status);
    }

    /**
     * 관리자 페이지에서 충전 요청에 대한 컨펌
     * @param id
     */
    @PostMapping("/confirm/{id}")
    public void confirm(@PathVariable Long id) {
        pointAdminService.confirm(id);
    }

    /**
     * 관리자 페이지에서 충전 요청에 대한 거부
     * @param id
     */
    @PostMapping("/reject/{id}")
    public void reject(@PathVariable Long id) {
        pointAdminService.reject(id);
    }
}
