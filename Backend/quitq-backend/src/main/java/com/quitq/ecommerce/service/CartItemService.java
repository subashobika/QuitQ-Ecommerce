package com.quitq.ecommerce.service;

import com.quitq.ecommerce.dto.CartItemDTO;
import com.quitq.ecommerce.entity.CartItem;
import com.quitq.ecommerce.entity.Product;
import com.quitq.ecommerce.entity.User;
import com.quitq.ecommerce.exception.ResourceNotFoundException;
import com.quitq.ecommerce.repository.CartItemRepository;
import com.quitq.ecommerce.repository.ProductRepository;
import com.quitq.ecommerce.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CartItemService {

    private static final Logger logger = LoggerFactory.getLogger(CartItemService.class);

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public CartItemDTO addToCart(Long productId, Integer quantity, String email) {
        logger.info("Adding to cart: productId={}, quantity={}, email={}", productId, quantity, email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + productId));

        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be positive");
        }
        if (product.getStock() < quantity) {
            throw new IllegalArgumentException("Insufficient stock for product ID: " + productId);
        }

        CartItem existingCartItem = cartItemRepository.findByUserIdAndProductId(user.getId(), productId).orElse(null);
        if (existingCartItem != null) {
            existingCartItem.setQuantity(existingCartItem.getQuantity() + quantity);
            CartItem savedItem = cartItemRepository.save(existingCartItem);
            logger.info("Updated existing cart item: {}", savedItem.getId());
            return convertToDTO(savedItem);
        }

        CartItem cartItem = new CartItem();
        cartItem.setUser(user);
        cartItem.setProduct(product);
        cartItem.setQuantity(quantity);
        CartItem savedItem = cartItemRepository.save(cartItem); // Explicit save
        logger.info("Saved new cart item: {}", savedItem.getId());


        return convertToDTO(savedItem);
    }

    @Transactional(readOnly = true)
    public List<CartItemDTO> getCartItems(String email) {
        logger.info("Retrieving cart items for email: {}, userId: {}", email, userRepository.findByEmail(email).map(User::getId).orElse(null));
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        List<CartItem> cartItems = cartItemRepository.findByUserId(user.getId());
        logger.info("Found {} cart items for userId: {}", cartItems.size(), user.getId());
        return cartItems.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public void removeFromCart(Long cartItemId, String email) {
        logger.info("Removing cart item with id: {}, email={}", cartItemId, email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with ID: " + cartItemId));

        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Cart item does not belong to user with email: " + email);
        }

        cartItemRepository.delete(cartItem);
        logger.info("Deleted cart item: {}", cartItemId);
    }

    public void removeItemByProductId(Long productId, String email) {
        logger.info("Removing cart item by productId: {}, email={}", productId, email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        CartItem cartItem = cartItemRepository.findByUserIdAndProductId(user.getId(), productId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found for productId: " + productId));

        cartItemRepository.delete(cartItem);
        logger.info("Deleted cart item for productId: {}", productId);
    }

    public void updateQuantity(Long productId, Integer quantity, String email) {
        logger.info("Updating quantity for productId: {}, quantity={}, email={}", productId, quantity, email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        CartItem cartItem = cartItemRepository.findByUserIdAndProductId(user.getId(), productId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found for productId: " + productId));

        if (quantity <= 0) {
            removeItemByProductId(productId, email);
        } else {
            Product product = cartItem.getProduct();
            if (product.getStock() < (quantity - cartItem.getQuantity())) {
                throw new IllegalArgumentException("Insufficient stock for product ID: " + productId);
            }
            cartItem.setQuantity(quantity);
            CartItem savedItem = cartItemRepository.save(cartItem); // Explicit save
            logger.info("Updated quantity for cart item: {}", savedItem.getId());
        }
    }

    private CartItemDTO convertToDTO(CartItem cartItem) {
        CartItemDTO dto = new CartItemDTO();
        dto.setId(cartItem.getId());
        dto.setUserId(cartItem.getUser().getId());
        dto.setProductId(cartItem.getProduct().getId());
        dto.setProductName(cartItem.getProduct().getName());
        dto.setQuantity(cartItem.getQuantity());
        dto.setPrice(cartItem.getProduct().getPrice());
        return dto;
    }
}





