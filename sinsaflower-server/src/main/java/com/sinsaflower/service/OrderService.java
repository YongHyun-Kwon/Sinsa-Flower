package com.sinsaflower.service;

import com.sinsaflower.domain.order.Order;
import com.sinsaflower.domain.user.User;
import com.sinsaflower.dto.OrderDto;
import com.sinsaflower.exception.BusinessException;
import com.sinsaflower.exception.ResourceNotFoundException;
import com.sinsaflower.repository.OrderRepository;
import com.sinsaflower.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    /**
     * 주문 생성
     */
    @Transactional
    public OrderDto.OrderResponse createOrder(Long buyerId, OrderDto.CreateOrderRequest request) {
        log.info("주문 생성 시작 - 발주자: {}, 수주자: {}", buyerId, request.getSellerId());
        
        try {
            // 입력 데이터 검증
            validateCreateOrderRequest(request);
            
            // 발주자 정보 검증
            User buyer = findUserById(buyerId);
            User seller = null;
            
            // 직발주인 경우에만 수주자 정보 검증
            if (request.getOrderType() == Order.OrderType.DIRECT && request.getSellerId() != null) {
                seller = findUserById(request.getSellerId());
                // 비즈니스 규칙 검증 (직발주일 때만)
                validateOrderBusinessRules(buyer, seller, request);
            }

            // Order 엔티티 생성 및 저장
            Order order = buildOrderFromRequest(buyerId, request);
            Order savedOrder = orderRepository.save(order);
            
            log.info("주문 생성 완료 - 주문 ID: {}", savedOrder.getOrderId());
            return convertToOrderResponse(savedOrder, buyer, seller);

        } catch (BusinessException | ResourceNotFoundException e) {
            // 이미 처리된 예외는 그대로 전파
            throw e;
        } catch (Exception e) {
            log.error("주문 생성 실패 - 발주자: {}, 수주자: {}", buyerId, request.getSellerId(), e);
            throw BusinessException.internalServerError("주문 생성 중 오류가 발생했습니다.");
        }
    }

    /**
     * 발주 목록 조회 (내가 발주한 주문들)
     */
    public List<OrderDto.OrderListResponse> getMyOrders(Long buyerId, OrderDto.OrderSearchRequest searchRequest) {
        log.debug("발주 목록 조회 - 사용자 ID: {}", buyerId);
        
        try {
            // 사용자 존재 여부 확인
            findUserById(buyerId);
            
            List<Order> orders = findOrdersByBuyerIdAndCriteria(buyerId, searchRequest);
            
            return orders.stream()
                    .map(order -> convertToOrderListResponse(order, false)) // false = 발주 관점
                    .collect(Collectors.toList());

        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            log.error("발주 목록 조회 실패 - 사용자 ID: {}", buyerId, e);
            throw BusinessException.internalServerError("발주 목록 조회 중 오류가 발생했습니다.");
        }
    }

    /**
     * 수주 목록 조회 (내가 받은 주문들)
     */
    public List<OrderDto.OrderListResponse> getReceivedOrders(Long sellerId, OrderDto.OrderSearchRequest searchRequest) {
        log.debug("수주 목록 조회 - 사용자 ID: {}", sellerId);
        
        try {
            // 사용자 존재 여부 확인
            findUserById(sellerId);
            
            List<Order> orders = findOrdersBySellerIdAndCriteria(sellerId, searchRequest);
            
            return orders.stream()
                    .map(order -> convertToOrderListResponse(order, true)) // true = 수주 관점
                    .collect(Collectors.toList());

        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            log.error("수주 목록 조회 실패 - 사용자 ID: {}", sellerId, e);
            throw BusinessException.internalServerError("수주 목록 조회 중 오류가 발생했습니다.");
        }
    }

    /**
     * 미확인 주문 목록 조회
     */
    public List<OrderDto.OrderListResponse> getUnconfirmedOrders(Long sellerId) {
        log.debug("미확인 주문 목록 조회 - 사용자 ID: {}", sellerId);
        
        try {
            // 사용자 존재 여부 확인
            findUserById(sellerId);
            
            List<Order> orders = orderRepository.findBySellerIdAndOrderStatusOrderByOrderDateDesc(
                    sellerId, Order.OrderStatus.PENDING);

            return orders.stream()
                    .map(order -> convertToOrderListResponse(order, true)) // true = 수주 관점
                    .collect(Collectors.toList());

        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            log.error("미확인 주문 목록 조회 실패 - 사용자 ID: {}", sellerId, e);
            throw BusinessException.internalServerError("미확인 주문 목록 조회 중 오류가 발생했습니다.");
        }
    }

    /**
     * 주문 상세 조회
     */
    public OrderDto.OrderResponse getOrderDetail(Long orderId, Long userId) {
        log.debug("주문 상세 조회 - 주문 ID: {}, 사용자 ID: {}", orderId, userId);
        
        try {
            Order order = findOrderById(orderId);
            
            // 권한 확인 (발주자나 수주자만 조회 가능)
            validateOrderAccess(order, userId);

            User buyer = findUserById(order.getBuyerId());
            User seller = order.getSellerId() != null ? findUserById(order.getSellerId()) : null;

            return convertToOrderResponse(order, buyer, seller);

        } catch (BusinessException | ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            log.error("주문 상세 조회 실패 - 주문 ID: {}, 사용자 ID: {}", orderId, userId, e);
            throw BusinessException.internalServerError("주문 조회 중 오류가 발생했습니다.");
        }
    }

    /**
     * 주문 상태 업데이트
     */
    @Transactional
    public OrderDto.OrderResponse updateOrderStatus(Long orderId, Long userId, OrderDto.OrderStatusUpdateRequest request) {
        log.info("주문 상태 업데이트 - 주문 ID: {}, 사용자 ID: {}, 상태: {}", orderId, userId, request.getOrderStatus());
        
        try {
            Order order = findOrderById(orderId);
            
            // 권한 확인 (수주자만 상태 변경 가능)
            validateSellerAccess(order, userId);
            
            // 상태 변경 유효성 검증
            validateStatusTransition(order.getOrderStatus(), request.getOrderStatus());
            
            // 상태 업데이트
            updateOrderStatusAndMemo(order, request);
            
            Order updatedOrder = orderRepository.save(order);
            
            User buyer = findUserById(order.getBuyerId());
            User seller = order.getSellerId() != null ? findUserById(order.getSellerId()) : null;
            
            log.info("주문 상태 업데이트 완료 - 주문 ID: {}, 새 상태: {}", orderId, request.getOrderStatus());
            return convertToOrderResponse(updatedOrder, buyer, seller);

        } catch (BusinessException | ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            log.error("주문 상태 업데이트 실패 - 주문 ID: {}, 사용자 ID: {}", orderId, userId, e);
            throw BusinessException.internalServerError("주문 상태 업데이트 중 오류가 발생했습니다.");
        }
    }

    // === 헬퍼 메서드들 ===

    private void validateCreateOrderRequest(OrderDto.CreateOrderRequest request) {
        log.info(request.getOrderType().toString());
        if (request.getOrderType().equals(Order.OrderType.DIRECT) && request.getSellerId() == null) {
            throw BusinessException.badRequest("수주자 ID는 필수입니다.");
        } 
        if (request.getPaymentPrice() == null || request.getPaymentPrice() <= 0) {
            throw BusinessException.badRequest("결제 금액은 0보다 커야 합니다.");
        }
        if (!StringUtils.hasText(request.getRecipientName())) {
            throw BusinessException.badRequest("수취인 이름은 필수입니다.");
        }
        if (!StringUtils.hasText(request.getRecipientPhone())) {
            throw BusinessException.badRequest("수취인 전화번호는 필수입니다.");
        }
        if (!StringUtils.hasText(request.getDeliveryAddress())) {
            throw BusinessException.badRequest("배송 주소는 필수입니다.");
        }
    }

    private User findUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> ResourceNotFoundException.user(userId));
    }
    
    private Order findOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> ResourceNotFoundException.order(orderId));
    }

    private void validateOrderBusinessRules(User buyer, User seller, OrderDto.CreateOrderRequest request) {
        // 자기 자신에게 주문할 수 없음
        if (Objects.equals(buyer.getId(), seller.getId())) {
            throw BusinessException.badRequest("자기 자신에게는 주문할 수 없습니다.");
        }
        
        // 판매자가 활성 상태인지 확인
        if (seller.getStatus() != User.UserStatus.ACTIVE) {
            throw BusinessException.badRequest("비활성 상태의 판매자에게는 주문할 수 없습니다.");
        }
    }

    private void validateOrderAccess(Order order, Long userId) {
        // 오픈콜 주문의 경우 sellerId가 null일 수 있음
        if (!Objects.equals(order.getBuyerId(), userId) && 
            !(order.getSellerId() != null && Objects.equals(order.getSellerId(), userId))) {
            throw BusinessException.forbidden("해당 주문에 대한 접근 권한이 없습니다.");
        }
    }

    private void validateSellerAccess(Order order, Long userId) {
        // 오픈콜 주문의 경우 sellerId가 null이면 아직 수주자가 정해지지 않은 상태
        if (order.getSellerId() == null) {
            throw BusinessException.badRequest("아직 수주자가 정해지지 않은 주문입니다.");
        }
        if (!Objects.equals(order.getSellerId(), userId)) {
            throw BusinessException.forbidden("수주자만 주문 상태를 변경할 수 있습니다.");
        }
    }

    private void validateStatusTransition(Order.OrderStatus currentStatus, Order.OrderStatus newStatus) {
        // 완료된 주문이나 취소된 주문은 상태 변경 불가
        if (currentStatus == Order.OrderStatus.DELIVERED || currentStatus == Order.OrderStatus.CANCELLED) {
            throw BusinessException.badRequest("완료되거나 취소된 주문의 상태는 변경할 수 없습니다.");
        }
        
        // 현재 상태와 동일한 상태로 변경 시도
        if (currentStatus == newStatus) {
            throw BusinessException.badRequest("이미 동일한 상태입니다.");
        }
    }

    private List<Order> findOrdersByBuyerIdAndCriteria(Long buyerId, OrderDto.OrderSearchRequest searchRequest) {
        if (searchRequest.getOrderStatus() != null) {
            return orderRepository.findByBuyerIdAndOrderStatusOrderByOrderDateDesc(buyerId, searchRequest.getOrderStatus());
        } else {
            return orderRepository.findByBuyerIdOrderByOrderDateDesc(buyerId);
        }
    }

    private List<Order> findOrdersBySellerIdAndCriteria(Long sellerId, OrderDto.OrderSearchRequest searchRequest) {
        if (searchRequest.getOrderStatus() != null) {
            return orderRepository.findBySellerIdAndOrderStatusOrderByOrderDateDesc(sellerId, searchRequest.getOrderStatus());
        } else {
            return orderRepository.findBySellerIdOrderByOrderDateDesc(sellerId);
        }
    }

    private Order buildOrderFromRequest(Long buyerId, OrderDto.CreateOrderRequest request) {
        return Order.builder()
                .buyerId(buyerId)
                .sellerId(request.getSellerId())
                .orderType(request.getOrderType())
                .orderStatus(Order.OrderStatus.PENDING)
                .corporationName(request.getCorporationName())
                .deliveryRegion(request.getDeliveryRegion())
                .deliveryRegionPrice(request.getDeliveryRegionPrice())
                .productName(request.getProductName())
                .productDetail(request.getProductDetail())
                .originalPrice(request.getOriginalPrice())
                .paymentPrice(request.getPaymentPrice())
                .totalPrice(request.getTotalPrice())
                // 옵션 상품 금액
                .optionCake(request.getOptionCake() != null ? request.getOptionCake() : 0)
                .optionChampagne(request.getOptionChampagne() != null ? request.getOptionChampagne() : 0)
                .optionCandy(request.getOptionCandy() != null ? request.getOptionCandy() : 0)
                .optionEtc(request.getOptionEtc() != null ? request.getOptionEtc() : 0)
                .optionStand(request.getOptionStand() != null ? request.getOptionStand() : 0)
                .optionRibbon(request.getOptionRibbon() != null ? request.getOptionRibbon() : 0)
                .optionWine(request.getOptionWine() != null ? request.getOptionWine() : 0)
                .optionChocolate(request.getOptionChocolate() != null ? request.getOptionChocolate() : 0)
                .optionPepero(request.getOptionPepero() != null ? request.getOptionPepero() : 0)
                .optionDonation(request.getOptionDonation() != null ? request.getOptionDonation() : 0)
                .optionDelivery(request.getOptionDelivery() != null ? request.getOptionDelivery() : 0)
                // 옵션 체크박스
                .checkCake(request.getCheckCake() != null ? request.getCheckCake() : false)
                .checkChampagne(request.getCheckChampagne() != null ? request.getCheckChampagne() : false)
                .checkCandy(request.getCheckCandy() != null ? request.getCheckCandy() : false)
                .checkEtc(request.getCheckEtc() != null ? request.getCheckEtc() : false)
                .checkStand(request.getCheckStand() != null ? request.getCheckStand() : false)
                .checkRibbon(request.getCheckRibbon() != null ? request.getCheckRibbon() : false)
                .checkWine(request.getCheckWine() != null ? request.getCheckWine() : false)
                .checkChocolate(request.getCheckChocolate() != null ? request.getCheckChocolate() : false)
                .checkPepero(request.getCheckPepero() != null ? request.getCheckPepero() : false)
                .checkDonation(request.getCheckDonation() != null ? request.getCheckDonation() : false)
                .checkDelivery(request.getCheckDelivery() != null ? request.getCheckDelivery() : false)
                // 고객 정보
                .orderCustomerName(request.getOrderCustomerName())
                .orderCustomerPhone(request.getOrderCustomerPhone())
                .orderCustomerMobile(request.getOrderCustomerMobile())
                .recipientName(request.getRecipientName())
                .recipientPhone(request.getRecipientPhone())
                .recipientMobile(request.getRecipientMobile())
                // 배달 정보
                .deliveryDate(parseLocalDate(request.getDeliveryDate()))
                .deliveryDay(request.getDeliveryDay())
                .deliveryTime(parseLocalTime(request.getDeliveryTime()))
                .customTime(request.getCustomTime())
                .eventHour(request.getEventHour())
                .eventMinute(request.getEventMinute())
                .eventType(request.getEventType())
                .deliveryAddress(request.getDeliveryAddress())
                // 메시지 정보
                .congratulatoryMessage(request.getCongratulatoryMessage())
                .senderName(request.getSenderName())
                .cardMessage(request.getCardMessage())
                .requestMessage(request.getRequestMessage())
                // 첨부 파일
                .attachmentImage(request.getAttachmentImage())
                .imagePrivate(request.getImagePrivate() != null ? request.getImagePrivate() : false)
                .build();
    }

    private LocalDate parseLocalDate(String dateString) {
        if (!StringUtils.hasText(dateString)) {
            return null;
        }
        try {
            return LocalDate.parse(dateString, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        } catch (DateTimeParseException e) {
            log.warn("날짜 파싱 실패: {}", dateString, e);
            return null;
        }
    }

    private LocalTime parseLocalTime(String timeString) {
        if (!StringUtils.hasText(timeString)) {
            return null;
        }
        try {
            return LocalTime.parse(timeString, DateTimeFormatter.ofPattern("HH:mm:ss"));
        } catch (DateTimeParseException e) {
            try {
                // HH:mm 형식도 시도
                return LocalTime.parse(timeString, DateTimeFormatter.ofPattern("HH:mm"));
            } catch (DateTimeParseException e2) {
                log.warn("시간 파싱 실패: {}", timeString, e2);
                return null;
            }
        }
    }

    private void updateOrderStatusAndMemo(Order order, OrderDto.OrderStatusUpdateRequest request) {
        order.setOrderStatus(request.getOrderStatus());
        
        if (StringUtils.hasText(request.getRequestMessage())) {
            order.setRequestMessage(request.getRequestMessage());
        }
        
        // 완료 시간 설정
        if (request.getOrderStatus() == Order.OrderStatus.DELIVERED) {
            order.setCompletedAt(LocalDateTime.now());
        }
        
        order.setUpdatedAt(LocalDateTime.now());
    }

    // === 기존 변환 메서드들 (리팩토링 필요 시 별도 클래스로 분리 가능) ===
    
    private OrderDto.OrderResponse convertToOrderResponse(Order order, User buyer, User seller) {
        return OrderDto.OrderResponse.builder()
                .orderId(order.getOrderId())
                .orderType(order.getOrderType())
                .orderStatus(order.getOrderStatus())
                .buyerId(order.getBuyerId())
                .buyerName(getBestDisplayName(buyer))
                .buyerShopName(getBestShopName(buyer))
                .sellerId(order.getSellerId())
                .sellerName(seller != null ? getBestDisplayName(seller) : null)
                .sellerShopName(seller != null ? getBestShopName(seller) : null)
                .corporationName(order.getCorporationName())
                .deliveryRegion(order.getDeliveryRegion())
                .deliveryRegionPrice(order.getDeliveryRegionPrice())
                .productName(order.getProductName())
                .productDetail(order.getProductDetail())
                .originalPrice(order.getOriginalPrice())
                .paymentPrice(order.getPaymentPrice())
                .totalPrice(order.getTotalPrice())
                // 옵션 상품 금액
                .optionCake(order.getOptionCake())
                .optionChampagne(order.getOptionChampagne())
                .optionCandy(order.getOptionCandy())
                .optionEtc(order.getOptionEtc())
                .optionStand(order.getOptionStand())
                .optionRibbon(order.getOptionRibbon())
                .optionWine(order.getOptionWine())
                .optionChocolate(order.getOptionChocolate())
                .optionPepero(order.getOptionPepero())
                .optionDonation(order.getOptionDonation())
                .optionDelivery(order.getOptionDelivery())
                // 옵션 체크박스
                .checkCake(order.getCheckCake())
                .checkChampagne(order.getCheckChampagne())
                .checkCandy(order.getCheckCandy())
                .checkEtc(order.getCheckEtc())
                .checkStand(order.getCheckStand())
                .checkRibbon(order.getCheckRibbon())
                .checkWine(order.getCheckWine())
                .checkChocolate(order.getCheckChocolate())
                .checkPepero(order.getCheckPepero())
                .checkDonation(order.getCheckDonation())
                .checkDelivery(order.getCheckDelivery())
                // 고객 정보
                .orderCustomerName(order.getOrderCustomerName())
                .orderCustomerPhone(order.getOrderCustomerPhone())
                .orderCustomerMobile(order.getOrderCustomerMobile())
                .recipientName(order.getRecipientName())
                .recipientPhone(order.getRecipientPhone())
                .recipientMobile(order.getRecipientMobile())
                // 배달 정보
                .deliveryDate(order.getDeliveryDate() != null ? order.getDeliveryDate().toString() : null)
                .deliveryDay(order.getDeliveryDay())
                .deliveryTime(order.getDeliveryTime() != null ? order.getDeliveryTime().toString() : null)
                .customTime(order.getCustomTime())
                .eventHour(order.getEventHour())
                .eventMinute(order.getEventMinute())
                .eventType(order.getEventType())
                .deliveryAddress(order.getDeliveryAddress())
                // 메시지 정보
                .congratulatoryMessage(order.getCongratulatoryMessage())
                .senderName(order.getSenderName())
                .cardMessage(order.getCardMessage())
                .requestMessage(order.getRequestMessage())
                // 첨부 파일
                .attachmentImage(order.getAttachmentImage())
                .imagePrivate(order.getImagePrivate())
                // 시간 정보
                .orderDate(order.getOrderDate() != null ? order.getOrderDate().toString() : null)
                .updatedAt(order.getUpdatedAt() != null ? order.getUpdatedAt().toString() : null)
                .completedAt(order.getCompletedAt() != null ? order.getCompletedAt().toString() : null)
                .build();
    }

    private OrderDto.OrderListResponse convertToOrderListResponse(Order order, boolean isReceivedOrder) {
        return OrderDto.OrderListResponse.builder()
                .orderId(order.getOrderId())
                .orderNumber(generateOrderNumber(order.getOrderId(), order.getOrderDate()))
                .recipientName(order.getRecipientName())
                .productName(order.getProductName())
                .deliveryAddress(order.getDeliveryAddress())
                .totalPrice(order.getTotalPrice())
                .originalPrice(order.getOriginalPrice())
                .orderStatus(order.getOrderStatus())
                .deliveryDate(order.getDeliveryDate() != null ? order.getDeliveryDate().toString() : null)
                .orderDate(order.getOrderDate() != null ? order.getOrderDate().toString() : null)
                .counterpartName(isReceivedOrder ? 
                    getBestDisplayName(findUserById(order.getBuyerId())) : 
                    getBestDisplayName(findUserById(order.getSellerId())))
                .counterpartShopName(isReceivedOrder ? 
                    getBestShopName(findUserById(order.getBuyerId())) : 
                    getBestShopName(findUserById(order.getSellerId())))
                .region(isReceivedOrder ? 
                    getRegionFromAddress(findUserById(order.getBuyerId())) : 
                    getRegionFromAddress(findUserById(order.getSellerId())))
                .build();
    }

    private String getBestDisplayName(User user) {
        if (StringUtils.hasText(user.getName())) return user.getName();
        if (StringUtils.hasText(user.getCeoName())) return user.getCeoName();
        if (StringUtils.hasText(user.getCorporationName())) return user.getCorporationName();
        return user.getUserId();
    }

    private String getBestShopName(User user) {
        if (StringUtils.hasText(user.getCorporationName())) return user.getCorporationName();
        if (StringUtils.hasText(user.getName())) return user.getName();
        if (StringUtils.hasText(user.getCeoName())) return user.getCeoName();
        return user.getUserId();
    }

    private String generateOrderNumber(Long orderId, LocalDateTime orderDate) {
        String dateStr = orderDate != null ? orderDate.format(DateTimeFormatter.ofPattern("yyyyMMdd")) : "00000000";
        return String.format("ORD-%s-%06d", dateStr, orderId);
    }

    private String getRegionFromAddress(User user) {
        try {
            if (StringUtils.hasText(user.getBusinessAddress())) {
                String[] parts = user.getBusinessAddress().split(" ");
                if (parts.length >= 2) {
                    return parts[0] + " " + parts[1];
                }
                return parts[0];
            }
            if (StringUtils.hasText(user.getMemberActualAddress())) {
                String[] parts = user.getMemberActualAddress().split(" ");
                if (parts.length >= 2) {
                    return parts[0] + " " + parts[1];
                }
                return parts[0];
            }
        } catch (Exception e) {
            log.warn("주소에서 지역 정보 추출 실패: {}", e.getMessage());
        }
        return "미확인";
    }
} 