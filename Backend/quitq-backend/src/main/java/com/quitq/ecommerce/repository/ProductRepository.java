package com.quitq.ecommerce.repository;

import com.quitq.ecommerce.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findBySellerId(Long sellerId);

    List<Product> findByCategoryId(Long categoryId);

    List<Product> findByCategoryIdAndPriceGreaterThanEqual(Long categoryId, Double minPrice);

    List<Product> findByNameContaining(String name);

    @Query("SELECT p FROM Product p WHERE (:categoryId IS NULL OR p.category.id = :categoryId) AND (:minPrice IS NULL OR p.price >= :minPrice)")
    List<Product> findByCategoryIdAndMinPrice(@Param("categoryId") Long categoryId, @Param("minPrice") Double minPrice);

    List<Product> findByCategoryIdAndNameContainingIgnoreCase(Long categoryId, String name);
}

