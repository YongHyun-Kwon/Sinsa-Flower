package com.sinsaflower.controller;

import com.sinsaflower.domain.user.User;
import com.sinsaflower.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/members")
@RequiredArgsConstructor
public class MemberController {
    
    private final MemberService memberService;
    
    /**
     * 지역별 회원 검색
     * @param province 광역시도 (선택사항)
     * @param city 시군구 (선택사항)
     * @return 검색된 회원 목록
     */
    @GetMapping("/search")
    public ResponseEntity<List<User>> searchMembersByRegion(
            @RequestParam(required = false) String province,
            @RequestParam(required = false) String city) {
        
        List<User> members = memberService.findMembersByRegion(province, city);
        return ResponseEntity.ok(members);
    }
    
    /**
     * 모든 활성 회원 조회
     * @return 활성 회원 목록
     */
    @GetMapping("/active")
    public ResponseEntity<List<User>> getActiveMembers() {
        List<User> members = memberService.findActiveMembers();
        return ResponseEntity.ok(members);
    }
} 