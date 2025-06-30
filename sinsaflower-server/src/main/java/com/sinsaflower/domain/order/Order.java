package com.sinsaflower.domain.order;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import com.sinsaflower.domain.user.User;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Long orderId;

    // === 기본 주문 정보 ===
    @Enumerated(EnumType.STRING)
    @Column(name = "order_type", length = 20, nullable = false)
    private OrderType orderType; // 주문 유형 (opencall/direct)

    @Column(name = "buyer_id", nullable = false)
    private Long buyerId; // 발주자 ID (FK - User 테이블 참조)

    @Column(name = "seller_id")
    private Long sellerId; // 수주자 ID (FK - User 테이블 참조, 오픈콜의 경우 null 가능)

    @Column(name = "corporation_name", length = 255)
    private String corporationName; // 상호명

    @Column(name = "delivery_region", length = 255)
    private String deliveryRegion; // 배달지역

    @Column(name = "delivery_region_price")
    private Integer deliveryRegionPrice; // 배달지역 가격

    @Enumerated(EnumType.STRING)
    @Column(name = "order_status", nullable = false)
    @Builder.Default
    private OrderStatus orderStatus = OrderStatus.PENDING;

    // === 상품 정보 ===
    @Column(name = "product_name", length = 255, nullable = false)
    private String productName; // 상품명

    @Column(name = "product_detail", length = 255)
    private String productDetail; // 상세상품명

    // === 금액 정보 ===
    @Column(name = "original_price")
    private Integer originalPrice; // 원청금액

    @Column(name = "payment_price", nullable = false)
    private Integer paymentPrice; // 결제금액

    @Column(name = "total_price", nullable = false)
    private Integer totalPrice; // 총 결제액

    // === 옵션 상품 금액 ===
    @Column(name = "option_cake")
    @Builder.Default
    private Integer optionCake = 0;

    @Column(name = "option_champagne")
    @Builder.Default
    private Integer optionChampagne = 0;

    @Column(name = "option_candy")
    @Builder.Default
    private Integer optionCandy = 0;

    @Column(name = "option_etc")
    @Builder.Default
    private Integer optionEtc = 0;

    @Column(name = "option_stand")
    @Builder.Default
    private Integer optionStand = 0;

    @Column(name = "option_ribbon")
    @Builder.Default
    private Integer optionRibbon = 0;

    @Column(name = "option_wine")
    @Builder.Default
    private Integer optionWine = 0;

    @Column(name = "option_chocolate")
    @Builder.Default
    private Integer optionChocolate = 0;

    @Column(name = "option_pepero")
    @Builder.Default
    private Integer optionPepero = 0;

    @Column(name = "option_donation")
    @Builder.Default
    private Integer optionDonation = 0;

    @Column(name = "option_delivery")
    @Builder.Default
    private Integer optionDelivery = 0;

    // === 옵션 체크박스 ===
    @Column(name = "check_cake")
    @Builder.Default
    private Boolean checkCake = false;

    @Column(name = "check_champagne")
    @Builder.Default
    private Boolean checkChampagne = false;

    @Column(name = "check_candy")
    @Builder.Default
    private Boolean checkCandy = false;

    @Column(name = "check_etc")
    @Builder.Default
    private Boolean checkEtc = false;

    @Column(name = "check_stand")
    @Builder.Default
    private Boolean checkStand = false;

    @Column(name = "check_ribbon")
    @Builder.Default
    private Boolean checkRibbon = false;

    @Column(name = "check_wine")
    @Builder.Default
    private Boolean checkWine = false;

    @Column(name = "check_chocolate")
    @Builder.Default
    private Boolean checkChocolate = false;

    @Column(name = "check_pepero")
    @Builder.Default
    private Boolean checkPepero = false;

    @Column(name = "check_donation")
    @Builder.Default
    private Boolean checkDonation = false;

    @Column(name = "check_delivery")
    @Builder.Default
    private Boolean checkDelivery = false;

    // === 고객 정보 ===
    @Column(name = "order_customer_name", length = 100)
    private String orderCustomerName; // 주문고객명

    @Column(name = "order_customer_phone", length = 20)
    private String orderCustomerPhone; // 주문고객 전화번호

    @Column(name = "order_customer_mobile", length = 20)
    private String orderCustomerMobile; // 주문고객 핸드폰

    @Column(name = "recipient_name", length = 100, nullable = false)
    private String recipientName; // 받는고객명

    @Column(name = "recipient_phone", length = 20, nullable = false)
    private String recipientPhone; // 받는고객 전화번호

    @Column(name = "recipient_mobile", length = 20)
    private String recipientMobile; // 받는고객 핸드폰

    // === 배달 정보 ===
    @Column(name = "delivery_date")
    private LocalDate deliveryDate; // 배달일

    @Column(name = "delivery_day", length = 20)
    private String deliveryDay; // 배달요일

    @Column(name = "delivery_time")
    private LocalTime deliveryTime; // 배달시간

    @Column(name = "custom_time", length = 100)
    private String customTime; // 직접입력 시간

    @Column(name = "event_hour")
    private Integer eventHour; // 행사시간

    @Column(name = "event_minute")
    private Integer eventMinute; // 행사분

    @Column(name = "event_type", length = 20)
    private String eventType; // 행사타입 (ceremony/event)

    @Column(name = "delivery_address", length = 500, nullable = false)
    private String deliveryAddress; // 배달장소

    // === 메시지 정보 ===
    @Column(name = "congratulatory_message", length = 255)
    private String congratulatoryMessage; // 경조사어

    @Column(name = "sender_name", length = 100)
    private String senderName; // 보내는 분

    @Column(name = "card_message", columnDefinition = "TEXT")
    private String cardMessage; // 카드 문구

    @Column(name = "request_message", columnDefinition = "TEXT")
    private String requestMessage; // 요구사항

    // === 첨부 파일 ===
    @Column(name = "attachment_image", length = 500)
    private String attachmentImage; // 첨부 이미지 URL

    @Column(name = "image_private")
    @Builder.Default
    private Boolean imagePrivate = false; // 이미지 비공개 여부

    // === 상태 및 시간 정보 ===
    @Column(name = "order_date", nullable = false)
    private LocalDateTime orderDate; // 주문일

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt; // 수정일

    @Column(name = "completed_at")
    private LocalDateTime completedAt; // 완료일

    public enum OrderStatus {
        PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED, REFUNDED
    }

    public enum OrderType {
        OPENCALL("오픈콜"),
        DIRECT("직발주");
        
        private final String description;
        
        OrderType(String description) {
            this.description = description;
        }
        
        public String getDescription() {
            return description;
        }
        
        @JsonCreator
        public static OrderType fromString(String value) {
            if (value == null) return null;
            
            String lowerValue = value.toLowerCase().trim();
            
            switch (lowerValue) {
                case "opencall":
                    return OPENCALL;
                case "direct":
                    return DIRECT;
                default:
                    throw new IllegalArgumentException("올바르지 않은 주문 유형: " + value + 
                        ". 가능한 값: market, direct");
            }
        }
        
        @JsonValue
        public String toJsonValue() {
            return this.name().toLowerCase();
        }
    }

    @PrePersist
    protected void onCreate() {
        orderDate = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
} 