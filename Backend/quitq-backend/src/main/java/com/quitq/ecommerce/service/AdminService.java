package com.quitq.ecommerce.service;
import com.quitq.ecommerce.dto.OrderDTO;
import com.quitq.ecommerce.dto.UserDTO;
import com.quitq.ecommerce.entity.Order;
import com.quitq.ecommerce.entity.OrderItem;
import com.quitq.ecommerce.entity.OrderStatus;
import com.quitq.ecommerce.entity.User;
import com.quitq.ecommerce.exception.ResourceNotFoundException;
import com.quitq.ecommerce.repository.UserRepository;
import com.quitq.ecommerce.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
        userRepository.delete(user);
    }

    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public OrderDTO updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + id));
        try {
            order.setStatus(OrderStatus.valueOf(status.toUpperCase()));
            Order updatedOrder = orderRepository.save(order);
            return convertToDTO(updatedOrder);
        } catch (IllegalArgumentException e) {
            throw new ResourceNotFoundException("Invalid order status: " + status);
        }
    }

    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole().name());
        dto.setContactNumber(user.getContactNumber());
        dto.setGender(user.getGender());
        dto.setAddress(user.getAddress());
        return dto;
    }

    private OrderDTO convertToDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setUserId(order.getUser().getId());
        dto.setOrderDate(order.getOrderDate());
        dto.setStatus(order.getStatus().name());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setOrderItems(order.getOrderItems().stream().map(this::convertToOrderItemDTO).collect(Collectors.toList()));
        return dto;
    }

    private OrderDTO.OrderItemDTO convertToOrderItemDTO(OrderItem item) {
        OrderDTO.OrderItemDTO dto = new OrderDTO.OrderItemDTO();
        dto.setId(item.getId());
        dto.setProductId(item.getProduct().getId());
        dto.setQuantity(item.getQuantity());
        dto.setPrice(item.getPrice());
        return dto;
    }
}
