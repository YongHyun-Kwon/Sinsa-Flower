package com.sinsaflower.repository;

import com.sinsaflower.domain.user.DeliverySetting;
import com.sinsaflower.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DeliverySettingRepository extends JpaRepository<DeliverySetting, Long> {
    Optional<DeliverySetting> findByUser(User user);
} 