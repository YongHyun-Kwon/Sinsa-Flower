package com.sinsaflower.point.repository;

import com.sinsaflower.domain.user.User;
import com.sinsaflower.point.domain.PointLedger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PointLedgerRepository extends JpaRepository<PointLedger, Long> {

    @Query("SELECT COALESCE(SUM(pl.amount), 0) FROM PointLedger pl WHERE pl.user = :user")
    int getAvailablePoint(@Param("user") User user);
    List<PointLedger> findByUserOrderByCreatedAtDesc(User user);

}
