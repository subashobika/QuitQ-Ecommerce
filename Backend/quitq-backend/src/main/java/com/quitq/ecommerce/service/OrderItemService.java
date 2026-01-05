package com.quitq.ecommerce.service;

import com.quitq.ecommerce.dto.OrderItemDTO;
import com.quitq.ecommerce.entity.OrderItem;
import com.quitq.ecommerce.entity.User;
import com.quitq.ecommerce.exception.ResourceNotFoundException;
import com.quitq.ecommerce.repository.OrderItemRepository;
import com.quitq.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderItemService {

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private UserRepository userRepository;

    public List<OrderItemDTO> getAllOrderItems() {
        return orderItemRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    public List<OrderItemDTO> getOrderItemsByUserId(Long userId) {
        List<OrderItem> orderItems = orderItemRepository.findAll().stream()
                .filter(item -> item.getOrder().getUser().getId().equals(userId))
                .collect(Collectors.toList());
        return orderItems.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public Long getUserIdByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return user.getId();
    }

    private OrderItemDTO convertToDTO(OrderItem orderItem) {
        OrderItemDTO dto = new OrderItemDTO();
        dto.setId(orderItem.getId());
        dto.setProductId(orderItem.getProduct().getId());
        dto.setQuantity(orderItem.getQuantity());
        dto.setPrice(orderItem.getPrice());
        return dto;
    }
}
