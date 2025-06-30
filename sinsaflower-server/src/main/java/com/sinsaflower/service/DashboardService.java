package com.sinsaflower.service;

import com.sinsaflower.dto.DashboardInfoDto;
import com.sinsaflower.domain.board.Post;
import com.sinsaflower.domain.user.User;
import com.sinsaflower.repository.OrderRepository;
import com.sinsaflower.repository.PostRepository;
import com.sinsaflower.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final PostRepository postRepository;

    /**
     * 사용자 대시보드 정보 조회
     */
    public DashboardInfoDto getDashboardInfo(Long userId) {
        log.debug("대시보드 정보 조회 시작 - userId: {}", userId);
        
        try {
            // 1. 사용자 정보 조회
            String displayName = getUserDisplayName(userId);

            // 2. 미확인 수주 건수 조회
            Long unconfirmedOrderCount = getUnconfirmedOrderCountSafe(userId);

            // 3. 베스트 글 목록 조회
            List<DashboardInfoDto.BestPostDto> bestPostDtos = getBestPostsSafe();

            // 4. 실제적인 계정 정보 (현재는 기본값, 추후 정산/포인트 시스템과 연동 예정)
            BigDecimal balance = BigDecimal.valueOf(0); // 기본 잔액 0
            Integer sinsaPoints = 0; // 기본 포인트 0
            Integer gradePoints = 0; // 기본 등급점수 0
            
            // 사용자가 실제 거래가 있다면 임시로 일부 값 설정 (실제로는 Settlement 테이블 등에서 조회)
            if (unconfirmedOrderCount > 0) {
                balance = BigDecimal.valueOf(100000); // 임시값
                sinsaPoints = 1000; // 임시값
            }

            DashboardInfoDto result = DashboardInfoDto.builder()
                    .userName(displayName)
                    .balance(balance)
                    .sinsaPoints(sinsaPoints)
                    .gradePoints(gradePoints)
                    .unconfirmedOrderCount(unconfirmedOrderCount)
                    .bestPosts(bestPostDtos)
                    .isAbsent(false) // 추후 부재중 설정과 연동 예정
                    .build();
                    
            log.info("대시보드 정보 조회 완료 - 사용자: {}", displayName);
            return result;
                    
        } catch (Exception e) {
            log.error("대시보드 정보 조회 전체 실패 - userId: {}", userId, e);
            
            // 전체 실패 시에도 의미있는 기본값 반환
            return DashboardInfoDto.builder()
                    .userName("신사플라워")
                    .balance(BigDecimal.valueOf(0))
                    .sinsaPoints(0)
                    .gradePoints(0)
                    .unconfirmedOrderCount(0L)
                    .bestPosts(Collections.emptyList())
                    .isAbsent(false)
                    .build();
        }
    }

    private String getUserDisplayName(Long userId) {
        try {
            User user = userRepository.findById(userId).orElse(null);
            if (user != null) {
                // 실제 사용자명 사용 (boardNickname > name > corporationName > userId 순서)
                if (user.getBoardNickname() != null && !user.getBoardNickname().isEmpty()) {
                    log.debug("사용자 표시명 설정: {} (boardNickname)", user.getBoardNickname());
                    return user.getBoardNickname();
                } else if (user.getName() != null && !user.getName().isEmpty()) {
                    log.debug("사용자 표시명 설정: {} (name)", user.getName());
                    return user.getName();
                } else if (user.getCorporationName() != null && !user.getCorporationName().isEmpty()) {
                    log.debug("사용자 표시명 설정: {} (corporationName)", user.getCorporationName());
                    return user.getCorporationName();
                } else {
                    log.debug("사용자 표시명 설정: {} (userId)", user.getUserId());
                    return user.getUserId();
                }
            } else {
                log.warn("사용자 정보 없음 - userId: {}, 기본값 사용", userId);
                return "신사플라워";
            }
        } catch (Exception e) {
            log.error("사용자 정보 조회 실패 - userId: {}", userId, e);
            return "신사플라워";
        }
    }

    private Long getUnconfirmedOrderCountSafe(Long userId) {
        try {
            Long count = orderRepository.countUnconfirmedOrdersBySeller(userId);
            log.debug("미확인 수주 건수: {}", count);
            return count;
        } catch (Exception e) {
            log.error("미확인 수주 건수 조회 실패 - userId: {}", userId, e);
            return 0L;
        }
    }

    private List<DashboardInfoDto.BestPostDto> getBestPostsSafe() {
        try {
            List<Post> bestPosts = postRepository.findBestPostsByCommentCount()
                    .stream()
                    .limit(5) // 최대 5개
                    .collect(Collectors.toList());

            if (!bestPosts.isEmpty()) {
                List<DashboardInfoDto.BestPostDto> result = bestPosts.stream()
                        .map(post -> DashboardInfoDto.BestPostDto.builder()
                                .postId(post.getPostId())
                                .title(post.getTitle())
                                .createdDate(post.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy.MM.dd")))
                                .commentCount(post.getCommentCount())
                                .build())
                        .collect(Collectors.toList());
                log.debug("베스트 글 조회 성공: {}개", result.size());
                return result;
            } else {
                log.debug("베스트 글 없음 - 빈 목록 반환");
                return Collections.emptyList();
            }
        } catch (Exception e) {
            log.error("베스트 글 조회 실패", e);
            return Collections.emptyList();
        }
    }

    /**
     * 미확인 수주 건수 조회
     */
    public Long getUnconfirmedOrderCount(Long userId) {
        return getUnconfirmedOrderCountSafe(userId);
    }
} 