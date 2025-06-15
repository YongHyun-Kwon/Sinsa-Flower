package com.sinsaflower.repository;

import com.sinsaflower.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUserId(String userId);
    boolean existsByUserId(String userId);
    boolean existsByPhone(String phone);
    List<User> findByStatus(User.UserStatus status);
    
    // 지역별 회원 검색을 위한 메서드들
    List<User> findByBusinessProvinceAndBusinessCityAndStatus(String businessProvince, String businessCity, User.UserStatus status);
    List<User> findByBusinessProvinceAndStatus(String businessProvince, User.UserStatus status);
    List<User> findByStatusAndRole(User.UserStatus status, User.Role role);
    
    /**
     * 활성 상태의 화원 회원 조회
     */
    @Query("SELECT u FROM User u WHERE u.status = 'ACTIVE'")
    List<User> findActiveFlorists();
    
    /**
     * 검색 조건에 따른 활성 화원 회원 조회
     */
    @Query("SELECT u FROM User u " +
           "LEFT JOIN u.businessInfo b " +
           "WHERE u.status = 'ACTIVE' AND " +
           "CASE " +
           "WHEN :searchType = '상호명' THEN b.corporationName LIKE %:keyword% " +
           "WHEN :searchType = '대표자명' THEN u.name LIKE %:keyword% " +
           "WHEN :searchType = '전화번호' THEN u.phone LIKE %:keyword% " +
           "ELSE b.corporationName LIKE %:keyword% " +
           "END")
    List<User> findActiveFloristsBySearchCriteria(@Param("searchType") String searchType, @Param("keyword") String keyword);
} 