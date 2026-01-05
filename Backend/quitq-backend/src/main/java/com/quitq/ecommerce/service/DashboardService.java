package com.quitq.ecommerce.service;

import com.quitq.ecommerce.entity.Order;
import com.quitq.ecommerce.entity.OrderStatus;
import com.quitq.ecommerce.entity.Product;
import com.quitq.ecommerce.entity.User;
import com.quitq.ecommerce.repository.OrderRepository;
import com.quitq.ecommerce.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DashboardService {

    private static final Logger logger = LoggerFactory.getLogger(DashboardService.class);

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Transactional(readOnly = true)
    public DashboardStats getAdminDashboardStats() {
        List<Order> orders = orderRepository.findAll();
        logger.debug("Total orders retrieved: {}", orders.size());
        orders.forEach(order -> logger.debug("Order ID: {}, Status: {}, TotalAmount: {}", order.getId(), order.getStatus(), order.getTotalAmount()));
        double totalRevenue = orders.stream()
                .filter(order -> order.getStatus() == OrderStatus.PAID || order.getStatus() == OrderStatus.DELIVERED || order.getStatus() == OrderStatus.PENDING)
                .mapToDouble(order -> {
                    double amount = order.getTotalAmount() != null ? order.getTotalAmount() : 0.0;
                    logger.debug("Order ID: {}, Filtered Amount: {}", order.getId(), amount);
                    return amount;
                })
                .sum();
        long totalOrders = orders.size();
        logger.debug("Calculated Revenue: {}, Total Orders: {}", totalRevenue, totalOrders);

        return new DashboardStats(totalOrders, totalRevenue);
    }

    @Transactional(readOnly = true)
    public DashboardStats getSellerDashboardStats(User seller) {
        List<Product> products = productRepository.findBySellerId(seller.getId());
        List<Order> orders = orderRepository.findAll();
        logger.debug("Seller ID: {}, Products: {}", seller.getId(), products.size());

        double totalRevenue = orders.stream()
                .filter(order -> order.getStatus() == OrderStatus.PAID || order.getStatus() == OrderStatus.DELIVERED || order.getStatus() == OrderStatus.PENDING)
                .flatMap(order -> order.getOrderItems().stream())
                .filter(item -> products.stream()
                        .anyMatch(product -> product.getId().equals(item.getProduct().getId())))
                .mapToDouble(item -> {
                    double amount = item.getPrice() * item.getQuantity();
                    logger.debug("Order Item ID: {}, Seller Amount: {}", item.getId(), amount);
                    return amount;
                })
                .sum();

        long totalOrders = orders.stream()
                .filter(order -> order.getOrderItems().stream()
                        .anyMatch(item -> products.stream()
                                .anyMatch(product -> product.getId().equals(item.getProduct().getId()))))
                .count();

        logger.debug("Seller Revenue: {}, Seller Orders: {}", totalRevenue, totalOrders);

        return new DashboardStats(totalOrders, totalRevenue);
    }
}
