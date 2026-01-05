package com.quitq.ecommerce.service;

import com.quitq.ecommerce.dto.PaymentDTO;
import com.quitq.ecommerce.entity.*;
import com.quitq.ecommerce.exception.ResourceNotFoundException;
import com.quitq.ecommerce.repository.OrderRepository;
import com.quitq.ecommerce.repository.PaymentRepository;
import com.quitq.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public PaymentDTO processPayment(Long orderId, PaymentDTO paymentDTO) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = getUserIdByEmail(email);
        System.out.println("Authenticated userId: " + userId);
        System.out.println("Order userId: " + orderRepository.findById(orderId)
                .map(order -> order.getUser().getId())
                .orElse(null));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));
        order.setStatus(OrderStatus.PAID);
        orderRepository.save(order);

        if (!order.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Unauthorized to process payment for this order");
        }


        if (!order.getTotalAmount().equals(paymentDTO.getAmount())) {
            throw new ResourceNotFoundException("Payment amount does not match order total");
        }

        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setUser(user);
        payment.setAmount(paymentDTO.getAmount());
        payment.setPaymentMethod(PaymentMethod.valueOf(paymentDTO.getPaymentMethod().toUpperCase()));
        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setTransactionDate(new Date());

        Payment savedPayment = paymentRepository.save(payment);

        order.setStatus(OrderStatus.PAID);
        orderRepository.save(order);

        return convertToDTO(savedPayment);
    }

    public Long getUserIdByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return user.getId();
    }

    private PaymentDTO convertToDTO(Payment payment) {
        PaymentDTO dto = new PaymentDTO();
        dto.setId(payment.getId());
        if (payment.getOrder() != null) {
            dto.setOrderId(payment.getOrder().getId());
        }
        if (payment.getUser() != null) {
            dto.setUserId(payment.getUser().getId());
        }
        dto.setAmount(payment.getAmount());
        if (payment.getPaymentMethod() != null) {
            dto.setPaymentMethod(payment.getPaymentMethod().name());
        }
        if (payment.getStatus() != null) {
            dto.setStatus(payment.getStatus().name());
        }
        if (payment.getTransactionDate() != null) {
            dto.setTransactionDate(payment.getTransactionDate().toString());
        }
        return dto;
    }
}
