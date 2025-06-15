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

    /**
     * 사용자의 배송 지역 조회 (배송 가능 지역)
     */
    public String getDeliveryRegionByUser(User user) {
        return deliverySettingRepository.findByUser(user)
                .map(deliverySetting -> {
                    String deliveryArea = deliverySetting.getDeliveryAreaInfo();
                    return deliveryArea != null && !deliveryArea.trim().isEmpty() ? deliveryArea : "배송지역 미설정";
                })
                .orElse("배송지역 미설정");
    }

    /**
     * 사용자의 실제 주소 조회
     */
    public String getActualAddressByUser(User user) {
        return deliverySettingRepository.findByUser(user)
                .map(deliverySetting -> {
                    String address = deliverySetting.getMemberActualAddress();
                    return address != null && !address.trim().isEmpty() ? address : "실제주소 미설정";
                })
                .orElse("실제주소 미설정");
    }

    /**
     * 사용자의 배송비 조회 (실제 주소 기반 계산)
     */
    public Integer getDeliveryPriceByUser(User user) {
        return deliverySettingRepository.findByUser(user)
                .map(deliverySetting -> {
                    String address = deliverySetting.getMemberActualAddress();
                    return calculateDeliveryPriceFromAddress(address);
                })
                .orElse(38000); // 기본 배송비
    }

    /**
     * 주소 기반 배송비 계산
     */
    private Integer calculateDeliveryPriceFromAddress(String address) {
        if (address == null || address.trim().isEmpty()) {
            return 38000; // 기본 배송비
        }

        // 실제 주소를 기반으로 배송비 계산
        if (address.contains("서울특별시") || address.contains("서울시") || address.contains("서울")) {
            return 38000;
        } else if (address.contains("경기도") || address.contains("경기")) {
            // 경기도 내에서도 거리에 따라 차등
            if (address.contains("수원") || address.contains("성남") || address.contains("용인") || 
                address.contains("고양") || address.contains("부천") || address.contains("안양")) {
                return 40000;
            }
            return 38000;
        } else if (address.contains("인천광역시") || address.contains("인천시") || address.contains("인천")) {
            return 38000;
        } else if (address.contains("강원특별자치도") || address.contains("강원도") || address.contains("강원")) {
            return 50000;
        } else if (address.contains("제주특별자치도") || address.contains("제주도") || address.contains("제주")) {
            return 80000; // 제주도는 높은 배송비
        } else if (address.contains("부산") || address.contains("대구") || address.contains("대전") || 
                   address.contains("광주") || address.contains("울산")) {
            return 55000; // 광역시
        }

        return 45000; // 기타 지역 기본 배송비
    }
} 