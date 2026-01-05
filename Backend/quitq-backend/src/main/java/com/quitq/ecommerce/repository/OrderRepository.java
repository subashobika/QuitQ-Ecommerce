
package com.quitq.ecommerce.repository;

import com.quitq.ecommerce.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserId(Long userId);

    List<Order> findByStatus(String status);

    @Query("SELECT DISTINCT o FROM Order o JOIN FETCH o.orderItems oi JOIN oi.product p WHERE p.seller.id = :sellerId")
    List<Order> findOrdersWithItemsBySellerId(@Param("sellerId") Long sellerId);

}
