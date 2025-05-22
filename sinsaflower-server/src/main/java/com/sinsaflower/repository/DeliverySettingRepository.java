package com.sinsaflower.repository;

import com.sinsaflower.domain.user.DeliverySetting;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeliverySettingRepository extends JpaRepository<DeliverySetting, Long> {
} 