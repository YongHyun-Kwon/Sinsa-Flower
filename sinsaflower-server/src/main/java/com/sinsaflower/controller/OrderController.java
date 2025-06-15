package com.sinsaflower.controller;

import com.sinsaflower.domain.order.Order;
import com.sinsaflower.domain.user.User;
import com.sinsaflower.dto.OrderDto;
import com.sinsaflower.service.OrderService;
import com.sinsaflower.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final UserService userService;

    /**
     * 주문 생성 (발주하기)
     * multipart/form-data로 JSON 데이터와 이미지 파일을 함께 받음
     */
    @PostMapping
    public ResponseEntity<OrderDto.OrderResponse> createOrder(
            @RequestParam("orderInfo") String orderInfoJson,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) {
        try {
            User currentUser = getCurrentUser();
            
            // JSON 문자열을 CreateOrderRequest 객체로 변환
            ObjectMapper objectMapper = new ObjectMapper();
            OrderDto.CreateOrderRequest request = objectMapper.readValue(orderInfoJson, OrderDto.CreateOrderRequest.class);
            
            // 이미지 파일이 있다면 처리 (현재는 로그만 출력, 추후 파일 저장 로직 추가)
            if (imageFile != null && !imageFile.isEmpty()) {
                log.info("업로드된 이미지 파일: {}, 크기: {} bytes", 
                    imageFile.getOriginalFilename(), imageFile.getSize());
                // TODO: 이미지 파일 저장 로직 구현
            }
            
            OrderDto.OrderResponse response = orderService.createOrder(currentUser.getId(), request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("주문 생성 실패", e);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * 내 발주 목록 조회
     */
    @GetMapping("/my-orders")
    public ResponseEntity<List<OrderDto.OrderListResponse>> getMyOrders(
            @RequestParam(required = false) Order.OrderStatus status) {
        try {
            User currentUser = getCurrentUser();
            OrderDto.OrderSearchRequest searchRequest = OrderDto.OrderSearchRequest.builder()
                    .orderStatus(status)
                    .build();
            List<OrderDto.OrderListResponse> orders = orderService.getMyOrders(currentUser.getId(), searchRequest);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            log.error("발주 목록 조회 실패", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 내 수주 목록 조회
     */
    @GetMapping("/received-orders")
    public ResponseEntity<List<OrderDto.OrderListResponse>> getReceivedOrders(
            @RequestParam(required = false) Order.OrderStatus status) {
        try {
            User currentUser = getCurrentUser();
            OrderDto.OrderSearchRequest searchRequest = OrderDto.OrderSearchRequest.builder()
                    .orderStatus(status)
                    .build();
            List<OrderDto.OrderListResponse> orders = orderService.getReceivedOrders(currentUser.getId(), searchRequest);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            log.error("수주 목록 조회 실패", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 미확인 주문 목록 조회
     */
    @GetMapping("/unconfirmed")
    public ResponseEntity<List<OrderDto.OrderListResponse>> getUnconfirmedOrders() {
        try {
            User currentUser = getCurrentUser();
            List<OrderDto.OrderListResponse> orders = orderService.getUnconfirmedOrders(currentUser.getId());
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            log.error("미확인 주문 목록 조회 실패", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 주문 상세 조회
     */
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDto.OrderResponse> getOrderDetail(@PathVariable Long orderId) {
        try {
            User currentUser = getCurrentUser();
            OrderDto.OrderResponse order = orderService.getOrderDetail(orderId, currentUser.getId());
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            log.error("주문 상세 조회 실패 - orderId: {}", orderId, e);
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * 주문 상태 업데이트 (수주자용)
     */
    @PutMapping("/{orderId}/status")
    public ResponseEntity<OrderDto.OrderResponse> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestBody OrderDto.OrderStatusUpdateRequest request) {
        try {
            User currentUser = getCurrentUser();
            OrderDto.OrderResponse response = orderService.updateOrderStatus(orderId, currentUser.getId(), request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("주문 상태 업데이트 실패 - orderId: {}", orderId, e);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * 주문 확인 (PENDING -> CONFIRMED)
     */
    @PostMapping("/{orderId}/confirm")
    public ResponseEntity<OrderDto.OrderResponse> confirmOrder(@PathVariable Long orderId) {
        try {
            User currentUser = getCurrentUser();
            OrderDto.OrderStatusUpdateRequest request = OrderDto.OrderStatusUpdateRequest.builder()
                    .orderStatus(Order.OrderStatus.CONFIRMED)
                    .build();
            OrderDto.OrderResponse response = orderService.updateOrderStatus(orderId, currentUser.getId(), request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("주문 확인 실패 - orderId: {}", orderId, e);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * 주문 취소
     */
    @PostMapping("/{orderId}/cancel")
    public ResponseEntity<OrderDto.OrderResponse> cancelOrder(@PathVariable Long orderId) {
        try {
            User currentUser = getCurrentUser();
            OrderDto.OrderStatusUpdateRequest request = OrderDto.OrderStatusUpdateRequest.builder()
                    .orderStatus(Order.OrderStatus.CANCELLED)
                    .build();
            OrderDto.OrderResponse response = orderService.updateOrderStatus(orderId, currentUser.getId(), request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("주문 취소 실패 - orderId: {}", orderId, e);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * 배송 시작 (CONFIRMED -> SHIPPED)
     */
    @PostMapping("/{orderId}/ship")
    public ResponseEntity<OrderDto.OrderResponse> shipOrder(
            @PathVariable Long orderId,
            @RequestBody(required = false) OrderDto.OrderStatusUpdateRequest request) {
        try {
            User currentUser = getCurrentUser();
            if (request == null) {
                request = OrderDto.OrderStatusUpdateRequest.builder().build();
            }
            request.setOrderStatus(Order.OrderStatus.SHIPPED);
            OrderDto.OrderResponse response = orderService.updateOrderStatus(orderId, currentUser.getId(), request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("배송 시작 실패 - orderId: {}", orderId, e);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * 배송 완료 (SHIPPED -> DELIVERED)
     */
    @PostMapping("/{orderId}/deliver")
    public ResponseEntity<OrderDto.OrderResponse> deliverOrder(
            @PathVariable Long orderId,
            @RequestBody(required = false) OrderDto.OrderStatusUpdateRequest request) {
        try {
            User currentUser = getCurrentUser();
            if (request == null) {
                request = OrderDto.OrderStatusUpdateRequest.builder().build();
            }
            request.setOrderStatus(Order.OrderStatus.DELIVERED);
            OrderDto.OrderResponse response = orderService.updateOrderStatus(orderId, currentUser.getId(), request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("배송 완료 실패 - orderId: {}", orderId, e);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * 회원 검색 (직발주용)
     */
    @GetMapping("/search-members")
    public ResponseEntity<List<OrderDto.MemberSearchResponse>> searchMembers(
            @RequestParam(value = "searchType", required = false) String searchType,
            @RequestParam(value = "searchKeyword", required = false) String searchKeyword,
            @RequestParam(value = "region", required = false) String region) {
        try {
            List<OrderDto.MemberSearchResponse> members = userService.searchMembers(searchType, searchKeyword, region);
            return ResponseEntity.ok(members);
        } catch (Exception e) {
            log.error("회원 검색 실패", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    // === Helper Methods ===

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || "anonymousUser".equals(authentication.getName())) {
            throw new RuntimeException("인증되지 않은 사용자입니다.");
        }
        
        Object principal = authentication.getPrincipal();
        if (!(principal instanceof User)) {
            throw new RuntimeException("사용자 정보를 찾을 수 없습니다.");
        }
        
        return (User) principal;
    }
} 