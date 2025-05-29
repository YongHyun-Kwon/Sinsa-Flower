package com.sinsaflower.point.repository;

import com.sinsaflower.point.domain.PointChargeRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PointRequestChargeRepository extends JpaRepository<PointChargeRequest, Long> {
    List<PointChargeRequest> findByStatus(PointChargeRequest.RequestStatus status);
}
