package com.quitq.ecommerce.service;

import com.quitq.ecommerce.dto.OrderDTO;
import com.quitq.ecommerce.dto.OrderDTO.OrderItemDTO;
import com.quitq.ecommerce.entity.*;
import com.quitq.ecommerce.exception.ResourceNotFoundException;
import com.quitq.ecommerce.repository.CartItemRepository;
import com.quitq.ecommerce.repository.OrderRepository;
import com.quitq.ecommerce.repository.ProductRepository;
import com.quitq.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Transactional
    public OrderDTO placeOrder(Long shippingAddressId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = getUserIdByEmail(email);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        ShippingAddress shippingAddress = user.getShippingAddresses().stream()
                .filter(sa -> sa.getId().equals(shippingAddressId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Shipping address not found"));

        List<CartItem> cartItems = cartItemRepository.findByUserId(userId);
        if (cartItems.isEmpty()) {
            throw new ResourceNotFoundException("Cart is empty");
        }

        Order order = new Order();
        order.setUser(user);
        order.setShippingAddress(shippingAddress);
        order.setOrderDate(new Date());
        order.setStatus(OrderStatus.PENDING);

        List<OrderItem> orderItems = cartItems.stream().map(cartItem -> {
            Product product = cartItem.getProduct();
            if (product.getStock() < cartItem.getQuantity()) {
                throw new ResourceNotFoundException("Insufficient stock for product: " + product.getName());
            }
            product.setStock(product.getStock() - cartItem.getQuantity());
            productRepository.save(product);

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(product.getPrice() * cartItem.getQuantity());
            return orderItem;
        }).collect(Collectors.toList());

        Double totalAmount = orderItems.stream()
                .mapToDouble(OrderItem::getPrice)
                .sum();

        order.setOrderItems(orderItems);
        order.setTotalAmount(totalAmount);

        Order savedOrder = orderRepository.save(order);
        cartItemRepository.deleteAll(cartItems);

        return convertToDTO(savedOrder);
    }

    public Long getUserIdByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return user.getId();
    }

    @Transactional(readOnly = true)
    public List<OrderDTO> getOrdersForCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        if (user.getRole() == User.Role.ADMIN) {
            return orderRepository.findAll().stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        } else {
            return orderRepository.findByUserId(user.getId()).stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        }
    }

    @Transactional(readOnly = true)
    public OrderDTO getOrderById(Long id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + id));

        if (currentUser.getRole() != User.Role.ADMIN &&
                !order.getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You are not allowed to view this order");
        }

        return convertToDTO(order);
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

    @Transactional
    public void deleteOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + id));
        orderRepository.delete(order);
    }

    private OrderDTO convertToDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setUserId(order.getUser().getId());
        dto.setOrderDate(order.getOrderDate());
        dto.setStatus(order.getStatus().name());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setOrderItems(order.getOrderItems().stream()
                .map(this::convertToOrderItemDTO)
                .collect(Collectors.toList()));
        if (order.getShippingAddress() != null) {
            dto.setShippingAddressId(order.getShippingAddress().getId());
        }
        return dto;
    }

    private OrderItemDTO convertToOrderItemDTO(OrderItem item) {
        OrderItemDTO dto = new OrderItemDTO();
        dto.setId(item.getId());
        dto.setProductId(item.getProduct().getId());
        dto.setQuantity(item.getQuantity());
        dto.setPrice(item.getPrice());
        return dto;
    }

    @Transactional
    public void updateOrderStatusAfterPayment(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));
        order.setStatus(OrderStatus.PAID);
        orderRepository.save(order);
    }
    @Transactional(readOnly = true)
    public List<OrderDTO> getAllOrdersForAdmin() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }





}
