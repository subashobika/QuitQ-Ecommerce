package com.quitq.ecommerce.controller;

import com.quitq.ecommerce.dto.CartItemDTO;
import com.quitq.ecommerce.service.CartItemService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartItemController {

    private static final Logger logger = LoggerFactory.getLogger(CartItemController.class);

    @Autowired
    private CartItemService cartItemService;

    @PostMapping("/add")
    @PreAuthorize("hasAnyRole('ADMIN', 'SELLER', 'USER')")
    public ResponseEntity<CartItemDTO> addToCart(
            @RequestParam Long productId,
            @RequestParam Integer quantity,
            @AuthenticationPrincipal UserDetails userDetails) {
        logger.info("Add to cart requested: productId={}, quantity={}", productId, quantity);
        if (userDetails == null) {
            logger.warn("Add to cart attempt without authentication");
            throw new SecurityException("User authentication details are not available");
        }
        String email = userDetails.getUsername();
        CartItemDTO cartItem = cartItemService.addToCart(productId, quantity, email);
        logger.info("Product {} added to cart for user {}", productId, email);
        return ResponseEntity.ok(cartItem);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SELLER', 'USER')")
    public ResponseEntity<List<CartItemDTO>> getCartItems(
            @AuthenticationPrincipal UserDetails userDetails) {
        logger.info("Get cart items requested");
        if (userDetails == null) {
            logger.warn("Get cart items attempt without authentication");
            throw new SecurityException("User authentication details are not available");
        }
        String email = userDetails.getUsername();
        List<CartItemDTO> cartItems = cartItemService.getCartItems(email);
        logger.info("Returning {} cart items for user {}", cartItems.size(), email);
        return ResponseEntity.ok(cartItems);
    }

    @PutMapping("/update")
    @PreAuthorize("hasAnyRole('ADMIN', 'SELLER', 'USER')")
    public ResponseEntity<String> updateQuantity(
            @RequestParam Long productId,
            @RequestParam Integer quantity,
            @AuthenticationPrincipal UserDetails userDetails) {
        logger.info("Update cart quantity requested: productId={}, quantity={}", productId, quantity);
        if (userDetails == null) {
            logger.warn("Update quantity attempt without authentication");
            throw new SecurityException("User authentication details are not available");
        }
        String email = userDetails.getUsername();
        cartItemService.updateQuantity(productId, quantity, email);
        logger.info("Updated quantity for product {} to {} for user {}", productId, quantity, email);
        return ResponseEntity.ok("Updated successfully");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SELLER', 'USER')")
    public ResponseEntity<String> removeFromCart(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        logger.info("Remove from cart requested: cartItemId={}", id);
        if (userDetails == null) {
            logger.warn("Remove from cart attempt without authentication");
            throw new SecurityException("User authentication details are not available");
        }
        String email = userDetails.getUsername();
        cartItemService.removeFromCart(id, email);
        logger.info("Removed cart item {} for user {}", id, email);
        return ResponseEntity.ok("Removed Successfully");
    }
}
