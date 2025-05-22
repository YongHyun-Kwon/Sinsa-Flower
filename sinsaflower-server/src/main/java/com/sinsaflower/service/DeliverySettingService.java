package com.sinsaflower.service;

import com.sinsaflower.domain.user.DeliverySetting;
import com.sinsaflower.domain.user.User;
import com.sinsaflower.dto.SignupRequestDto;
import com.sinsaflower.repository.DeliverySettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DeliverySettingService {
    private final DeliverySettingRepository deliverySettingRepository;

    /**
     * DeliverySetting 저장
     */
    public void createDeliverySetting(User user, SignupRequestDto dto) {
        DeliverySetting deliverySetting = DeliverySetting.builder()
                .user(user)
                .deliveryAreaInfo(dto.getDeliveryAreaInfo())
                .memberActualAddress(dto.getMemberActualAddress())
                .mainPhoneNumber(dto.getMainPhoneNumber())
                .mainMobileNumber(dto.getMainMobileNumber())
                .autoProductRegister(dto.getAutoProductRegister())
                .handleFruitProducts(dto.getHandleFruitProducts())
                .handleCondolenceBasket(dto.getHandleCondolenceBasket())
                .expressDeliveryAvailable(dto.getExpressDeliveryAvailable())
                .handleRoundFlowerArrangement(dto.getHandleRoundFlowerArrangement())
                .blackGoldRibbonAvailable(dto.getBlackGoldRibbonAvailable())
                .handleLargeExtraLarge(dto.getHandleLargeExtraLarge())
                .handle4_5Tier(dto.getHandle4_5Tier())
                .handleBonsa(dto.getHandleBonsa())
                .holidayDeliveryAvailable(dto.getHolidayDeliveryAvailable())
                .nightDeliveryAvailable(dto.getNightDeliveryAvailable())
                .createdAt(java.time.LocalDateTime.now())
                .updatedAt(java.time.LocalDateTime.now())
                .build();
        deliverySettingRepository.save(deliverySetting);
    }
} 