package com.sinsaflower.dto;

import com.sinsaflower.domain.order.Order;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class OrderDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateOrderRequest {
        // === 기본 주문 정보 ===
        private Order.OrderType orderType; // 주문 유형
        private Long sellerId; // 수주처 PK ID
        private String corporationName; // 상호명
        private String deliveryRegion; // 배달지역
        private Integer deliveryRegionPrice; // 배달지역 가격
        
        // === 상품 정보 ===
        private String productName; // 상품명
        private String productDetail; // 상세상품명
        
        // === 금액 정보 ===
        private Integer originalPrice; // 원청금액
        private Integer paymentPrice; // 결제금액
        private Integer totalPrice; // 총 결제액
        
        // === 옵션 상품 금액 ===
        private Integer optionCake;
        private Integer optionChampagne;
        private Integer optionCandy;
        private Integer optionEtc;
        private Integer optionStand;
        private Integer optionRibbon;
        private Integer optionWine;
        private Integer optionChocolate;
        private Integer optionPepero;
        private Integer optionDonation;
        private Integer optionDelivery;
        
        // === 옵션 체크박스 ===
        private Boolean checkCake;
        private Boolean checkChampagne;
        private Boolean checkCandy;
        private Boolean checkEtc;
        private Boolean checkStand;
        private Boolean checkRibbon;
        private Boolean checkWine;
        private Boolean checkChocolate;
        private Boolean checkPepero;
        private Boolean checkDonation;
        private Boolean checkDelivery;
        
        // === 고객 정보 ===
        private String orderCustomerName; // 주문고객명
        private String orderCustomerPhone; // 주문고객 전화번호
        private String orderCustomerMobile; // 주문고객 핸드폰
        private String recipientName; // 받는고객명
        private String recipientPhone; // 받는고객 전화번호
        private String recipientMobile; // 받는고객 핸드폰
        
        // === 배달 정보 ===
        private String deliveryDate; // 배달일 (yyyy-MM-dd 형식)
        private String deliveryDay; // 배달요일
        private String deliveryTime; // 배달시간 (HH:mm:ss 형식)
        private String customTime; // 직접입력 시간
        private Integer eventHour; // 행사시간
        private Integer eventMinute; // 행사분
        private String eventType; // 행사타입 (ceremony/event)
        private String deliveryAddress; // 배달장소
        
        // === 메시지 정보 ===
        private String congratulatoryMessage; // 경조사어
        private String senderName; // 보내는 분
        private String cardMessage; // 카드 문구
        private String requestMessage; // 요구사항
        
        // === 첨부 파일 ===
        private String attachmentImage; // 첨부 이미지 URL
        private Boolean imagePrivate; // 이미지 비공개 여부
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderResponse {
        // === 기본 정보 ===
        private Long orderId;
        private Order.OrderType orderType;
        private Order.OrderStatus orderStatus;
        
        // === 사용자 정보 ===
        private Long buyerId;
        private String buyerName;
        private String buyerShopName;
        private Long sellerId;
        private String sellerName;
        private String sellerShopName;
        private String corporationName;
        private String deliveryRegion;
        private Integer deliveryRegionPrice;
        
        // === 상품 정보 ===
        private String productName;
        private String productDetail;
        
        // === 금액 정보 ===
        private Integer originalPrice;
        private Integer paymentPrice;
        private Integer totalPrice;
        
        // === 옵션 상품 금액 ===
        private Integer optionCake;
        private Integer optionChampagne;
        private Integer optionCandy;
        private Integer optionEtc;
        private Integer optionStand;
        private Integer optionRibbon;
        private Integer optionWine;
        private Integer optionChocolate;
        private Integer optionPepero;
        private Integer optionDonation;
        private Integer optionDelivery;
        
        // === 옵션 체크박스 ===
        private Boolean checkCake;
        private Boolean checkChampagne;
        private Boolean checkCandy;
        private Boolean checkEtc;
        private Boolean checkStand;
        private Boolean checkRibbon;
        private Boolean checkWine;
        private Boolean checkChocolate;
        private Boolean checkPepero;
        private Boolean checkDonation;
        private Boolean checkDelivery;
        
        // === 고객 정보 ===
        private String orderCustomerName;
        private String orderCustomerPhone;
        private String orderCustomerMobile;
        private String recipientName;
        private String recipientPhone;
        private String recipientMobile;
        
        // === 배달 정보 ===
        private String deliveryDate;
        private String deliveryDay;
        private String deliveryTime;
        private String customTime;
        private Integer eventHour;
        private Integer eventMinute;
        private String eventType;
        private String deliveryAddress;
        
        // === 메시지 정보 ===
        private String congratulatoryMessage;
        private String senderName;
        private String cardMessage;
        private String requestMessage;
        
        // === 첨부 파일 ===
        private String attachmentImage;
        private Boolean imagePrivate;
        
        // === 시간 정보 ===
        private String orderDate;
        private String updatedAt;
        private String completedAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderListResponse {
        private Long orderId;
        private String orderNumber;
        private String recipientName;
        private String productName;
        private String deliveryAddress;
        private Integer totalPrice;
        private Integer originalPrice;
        private Order.OrderStatus orderStatus;
        private String deliveryDate;
        private String orderDate;
        
        // 발주/수주 구분용
        private String counterpartName;
        private String counterpartShopName;
        private String region;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderSearchRequest {
        private String startDate;
        private String endDate;
        private Order.OrderStatus orderStatus;
        private String recipientName;
        private String productName;
        private String deliveryAddress;
        private Integer page = 0;
        private Integer size = 20;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderStatusUpdateRequest {
        private Order.OrderStatus orderStatus;
        private String requestMessage;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MemberSearchResponse {
        private Long id;
        private String corporationName;
        private String ownerName;
        private String phoneNumber;
        private String businessAddress;
        private String deliveryRegion;
        private Integer deliveryPrice;
    }
} 