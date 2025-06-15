package com.sinsaflower.service;

import com.sinsaflower.domain.user.User;
import com.sinsaflower.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MemberService {
    
    private final UserRepository userRepository;
    
    /**
     * 지역별 회원 검색
     * @param province 광역시도 (선택사항)
     * @param city 시군구 (선택사항)
     * @return 검색된 회원 목록
     */
    public List<User> findMembersByRegion(String province, String city) {
        if (province != null && city != null) {
            // 광역시도와 시군구 모두 지정된 경우
            return userRepository.findByBusinessProvinceAndBusinessCityAndStatus(
                province, city, User.UserStatus.ACTIVE);
        } else if (province != null) {
            // 광역시도만 지정된 경우
            return userRepository.findByBusinessProvinceAndStatus(
                province, User.UserStatus.ACTIVE);
        } else {
            // 조건이 없는 경우 모든 활성 회원 반환
            return findActiveMembers();
        }
    }
    
    /**
     * 모든 활성 회원 조회
     * @return 활성 회원 목록
     */
    public List<User> findActiveMembers() {
        return userRepository.findByStatusAndRole(
            User.UserStatus.ACTIVE, User.Role.BUSINESS);
    }
} 