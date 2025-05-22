package com.sinsaflower.domain.user;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "delivery_setting")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DeliverySetting {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // id

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // user_id

    @Column(length = 255)
    private String deliveryAreaInfo; // delivery_area_info

    @Column(length = 255)
    private String memberActualAddress; // member_actual_address

    @Column(length = 40)
    private String mainPhoneNumber; // main_phone_number

    @Column(length = 40)
    private String mainMobileNumber; // main_mobile_number

    @Column
    private Boolean autoProductRegister; // auto_product_register

    @Column
    private Boolean handleFruitProducts; // handle_fruit_products

    @Column
    private Boolean handleCondolenceBasket; // handle_condolence_basket

    @Column
    private Boolean expressDeliveryAvailable; // express_delivery_available

    @Column
    private Boolean handleRoundFlowerArrangement; // handle_round_flower_arrangement

    @Column
    private Boolean blackGoldRibbonAvailable; // black_gold_ribbon_available

    @Column
    private Boolean handleLargeExtraLarge; // handle_large_extra_large

    @Column
    private Boolean handle4_5Tier; // handle_4_5_tier

    @Column
    private Boolean handleBonsa; // handle_bonsa

    @Column
    private Boolean holidayDeliveryAvailable; // holiday_delivery_available

    @Column
    private Boolean nightDeliveryAvailable; // night_delivery_available

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt; // created_at

    @Column(nullable = false)
    private LocalDateTime updatedAt; // updated_at
} 