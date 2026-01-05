package com.quitq.ecommerce.controller;

import com.quitq.ecommerce.dto.OrderDTO;
import com.quitq.ecommerce.dto.ProductDTO;
import com.quitq.ecommerce.dto.UserDTO;
import com.quitq.ecommerce.entity.User;
import com.quitq.ecommerce.repository.UserRepository;
import com.quitq.ecommerce.service.DashboardService;
import com.quitq.ecommerce.service.DashboardStats;
import com.quitq.ecommerce.service.SellerService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

@RestController
@RequestMapping("/api/seller")
public class SellerController {

    private static final Logger logger = LoggerFactory.getLogger(SellerController.class);

    @Autowired
    private SellerService sellerService;

    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/products")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<ProductDTO> addProduct(@Valid @RequestBody ProductDTO productDTO, HttpServletRequest request) {
        logger.info("Seller request to add product: {}", productDTO);
        ProductDTO savedProduct = sellerService.addProduct(productDTO, request);
        logger.info("Product added successfully with id: {}", savedProduct.getId());
        return ResponseEntity.ok(savedProduct);
    }

    @GetMapping("/products")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<List<ProductDTO>> getAllProducts(HttpServletRequest request) {
        logger.info("Seller request to get all products");
        List<ProductDTO> products = sellerService.getProductsBySeller(request);
        logger.info("Returning {} products", products.size());
        return ResponseEntity.ok(products);
    }

    @PutMapping("/products/{id}")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductDTO productDTO) {
        logger.info("Seller request to update product with id: {} using data: {}", id, productDTO);
        ProductDTO updatedProduct = sellerService.updateProduct(id, productDTO);
        logger.info("Product updated successfully with id: {}", updatedProduct.getId());
        return ResponseEntity.ok(updatedProduct);
    }

    @DeleteMapping("/products/{id}")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        logger.info("Seller request to delete product with id: {}", id);
        sellerService.deleteProduct(id);
        logger.info("Product with id: {} deleted successfully", id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<DashboardStats> getDashboard(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            logger.error("Seller dashboard request failed: userDetails is null");
            throw new SecurityException("User authentication details are not available");
        }
        String email = userDetails.getUsername();
        logger.info("Fetching dashboard stats for seller with email: {}", email);
        User seller = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    logger.error("Seller not found with email: {}", email);
                    return new RuntimeException("Seller not found: " + email);
                });
        DashboardStats stats = dashboardService.getSellerDashboardStats(seller);
        logger.info("Returning dashboard stats for seller id: {}", seller.getId());
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/orders")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<List<OrderDTO>> getSellerOrders(HttpServletRequest request) {
        logger.info("Seller request to get orders");
        List<OrderDTO> orders = sellerService.getOrdersBySeller(request);
        logger.info("Returning {} orders", orders.size());
        return ResponseEntity.ok(orders);
    }

    @PutMapping("/orders/{id}/status")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<OrderDTO> updateOrderStatus(@PathVariable Long id, @RequestParam String status) {
        logger.info("Seller request to update order status for order id: {} to status: {}", id, status);
        OrderDTO updatedOrder = sellerService.updateOrderStatus(id, status);
        logger.info("Order status updated successfully for order id: {}", id);
        return ResponseEntity.ok(updatedOrder);
    }

    @GetMapping("/profile")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<UserDTO> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            logger.error("Seller profile request failed: userDetails is null");
            throw new SecurityException("User authentication details are not available");
        }
        String email = userDetails.getUsername();
        logger.info("Fetching profile for seller with email: {}", email);
        User seller = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    logger.error("Seller not found with email: {}", email);
                    return new RuntimeException("Seller not found");
                });
        UserDTO dto = convertToUserDTO(seller);
        logger.info("Returning profile data for seller id: {}", seller.getId());
        return ResponseEntity.ok(dto);
    }

    private UserDTO convertToUserDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setContactNumber(user.getContactNumber());
        dto.setGender(user.getGender());
        dto.setAddress(user.getAddress());
        dto.setBusinessName(user.getBusinessName());
        dto.setTaxId(user.getTaxId());
        dto.setBusinessAddress(user.getBusinessAddress());
        dto.setRole(user.getRole().name());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        return dto;
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<User> updateProfile(@AuthenticationPrincipal UserDetails userDetails, @Valid @RequestBody User updatedUser) {
        if (userDetails == null) {
            logger.error("Seller profile update failed: userDetails is null");
            throw new SecurityException("User authentication details are not available");
        }
        String email = userDetails.getUsername();
        logger.info("Seller request to update profile for email: {}", email);
        User seller = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    logger.error("Seller not found with email: {}", email);
                    return new RuntimeException("Seller not found");
                });

        seller.setName(updatedUser.getName());
        seller.setContactNumber(updatedUser.getContactNumber());
        seller.setAddress(updatedUser.getAddress());
        seller.setGender(updatedUser.getGender());

        seller.setBusinessName(updatedUser.getBusinessName());
        seller.setTaxId(updatedUser.getTaxId());
        seller.setBusinessAddress(updatedUser.getBusinessAddress());

        User savedSeller = userRepository.save(seller);
        logger.info("Seller profile updated successfully for id: {}", savedSeller.getId());
        return ResponseEntity.ok(savedSeller);
    }

    @DeleteMapping("/profile")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<Void> deleteProfile(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            logger.error("Seller profile delete failed: userDetails is null");
            throw new SecurityException("User authentication details are not available");
        }
        String email = userDetails.getUsername();
        logger.info("Seller request to delete profile with email: {}", email);
        User seller = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    logger.error("Seller not found with email: {}", email);
                    return new RuntimeException("Seller not found");
                });
        userRepository.delete(seller);
        logger.info("Seller profile deleted successfully for id: {}", seller.getId());
        return ResponseEntity.ok().build();
    }
}
