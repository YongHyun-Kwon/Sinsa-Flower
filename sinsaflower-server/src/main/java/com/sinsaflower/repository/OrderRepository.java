package com.sinsaflower.repository;

import com.sinsaflower.domain.order.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    // 구매자별 주문 목록
    List<Order> findByBuyerIdOrderByOrderDateDesc(Long buyerId);
    
    // 판매자별 주문 목록
    List<Order> findBySellerIdOrderByOrderDateDesc(Long sellerId);
    
    // 미확인 수주 건수 (판매자가 아직 확인하지 않은 주문)
    @Query("SELECT COUNT(o) FROM Order o WHERE o.sellerId = :sellerId AND o.orderStatus = 'PENDING'")
    Long countUnconfirmedOrdersBySeller(@Param("sellerId") Long sellerId);
    
    // 특정 상태의 주문 목록
    List<Order> findByBuyerIdAndOrderStatusOrderByOrderDateDesc(Long buyerId, Order.OrderStatus orderStatus);
    
    // 특정 판매자의 특정 상태 주문 목록
    List<Order> findBySellerIdAndOrderStatusOrderByOrderDateDesc(Long sellerId, Order.OrderStatus orderStatus);
} 