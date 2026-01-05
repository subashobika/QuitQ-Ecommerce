package com.quitq.ecommerce.service;

import com.quitq.ecommerce.dto.OrderDTO;
import com.quitq.ecommerce.dto.ProductDTO;
import com.quitq.ecommerce.entity.Category;
import com.quitq.ecommerce.entity.Order;
import com.quitq.ecommerce.entity.Product;
import com.quitq.ecommerce.entity.User;
import com.quitq.ecommerce.entity.OrderStatus;
import com.quitq.ecommerce.exception.ResourceNotFoundException;
import com.quitq.ecommerce.repository.CategoryRepository;
import com.quitq.ecommerce.repository.OrderRepository;
import com.quitq.ecommerce.repository.ProductRepository;
import com.quitq.ecommerce.repository.UserRepository;
import com.quitq.ecommerce.config.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SellerService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private DashboardService dashboardService;

    public ProductDTO addProduct(ProductDTO productDTO, HttpServletRequest request) {
        if (productDTO.getCategoryId() == null) {
            throw new ResourceNotFoundException("Category ID is required");
        }

        Category category = categoryRepository.findById(productDTO.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + productDTO.getCategoryId()));

        String token = extractTokenFromRequest(request);
        String sellerEmail = jwtUtil.extractUsername(token);
        User seller = userRepository.findByEmail(sellerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Seller not found with email: " + sellerEmail));

        Product product = new Product();
        product.setName(productDTO.getName());
        product.setPrice(productDTO.getPrice());
        product.setDescription(productDTO.getDescription());
        product.setCategory(category);
        product.setImageUrl(productDTO.getImageUrl());
        product.setStock(productDTO.getStock() != null ? productDTO.getStock() : 0);
        product.setSeller(seller);

        Product savedProduct = productRepository.save(product);
        return convertToDTO(savedProduct);
    }

    public List<ProductDTO> getProductsBySeller(HttpServletRequest request) {
        String token = extractTokenFromRequest(request);
        String sellerEmail = jwtUtil.extractUsername(token);
        User seller = userRepository.findByEmail(sellerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Seller not found with email: " + sellerEmail));
        List<Product> products = productRepository.findBySellerId(seller.getId());
        return products.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public ProductDTO updateProduct(Long id, ProductDTO productDTO) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));

        Category category = categoryRepository.findById(productDTO.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        product.setName(productDTO.getName());
        product.setPrice(productDTO.getPrice());
        product.setDescription(productDTO.getDescription());
        product.setCategory(category);
        product.setImageUrl(productDTO.getImageUrl());
        product.setStock(productDTO.getStock() != null ? productDTO.getStock() : 0);

        Product updatedProduct = productRepository.save(product);
        return convertToDTO(updatedProduct);
    }

    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));
        productRepository.delete(product);
    }

    public DashboardStats getSellerDashboardStats(User seller) {
        return dashboardService.getSellerDashboardStats(seller);
    }

    public List<OrderDTO> getOrdersBySeller(HttpServletRequest request) {
        String token = extractTokenFromRequest(request);
        String sellerEmail = jwtUtil.extractUsername(token);
        User seller = userRepository.findByEmail(sellerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Seller not found with email: " + sellerEmail));

        List<Order> orders = orderRepository.findOrdersWithItemsBySellerId(seller.getId());

        return orders.stream()
                .map(this::convertToOrderDTO)
                .collect(Collectors.toList());
    }


    public OrderDTO updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));
        try {
            order.setStatus(OrderStatus.valueOf(status.toUpperCase()));
            Order updatedOrder = orderRepository.save(order);
            return convertToOrderDTO(updatedOrder);
        } catch (IllegalArgumentException e) {
            throw new ResourceNotFoundException("Invalid order status: " + status);
        }
    }



    public User getSellerProfile(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Seller not found with email: " + email));
    }

    public User updateSellerProfile(String email, User updatedUser) {
        User existingUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Seller not found with email: " + email));

        existingUser.setName(updatedUser.getName());
        existingUser.setContactNumber(updatedUser.getContactNumber());
        existingUser.setAddress(updatedUser.getAddress());
        existingUser.setGender(updatedUser.getGender());

        existingUser.setBusinessName(updatedUser.getBusinessName());
        existingUser.setTaxId(updatedUser.getTaxId());
        existingUser.setBusinessAddress(updatedUser.getBusinessAddress());

        existingUser.setUpdatedAt(LocalDateTime.now());

        return userRepository.save(existingUser);
    }

    public void deleteSellerProfile(String email) {
        User existingUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Seller not found with email: " + email));
        userRepository.delete(existingUser);
    }



    private String extractTokenFromRequest(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            throw new ResourceNotFoundException("Invalid Authorization header");
        }
        return header.substring(7);
    }

    private ProductDTO convertToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setPrice(product.getPrice());
        dto.setDescription(product.getDescription());
        dto.setCategoryId(product.getCategory() != null ? product.getCategory().getId() : null);
        dto.setImageUrl(product.getImageUrl());
        dto.setStock(product.getStock());
        return dto;
    }

    private OrderDTO convertToOrderDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setUserId(order.getUser() != null ? order.getUser().getId() : null);
        dto.setStatus(order.getStatus() != null ? order.getStatus().name() : null);
        dto.setTotalAmount(order.getTotalAmount());
        dto.setShippingAddressId(order.getShippingAddress() != null ? order.getShippingAddress().getId() : null);

        List<OrderDTO.OrderItemDTO> items = order.getOrderItems().stream().map(item -> {
            OrderDTO.OrderItemDTO itemDTO = new OrderDTO.OrderItemDTO();
            itemDTO.setId(item.getId());
            itemDTO.setProductId(item.getProduct() != null ? item.getProduct().getId() : null);
            itemDTO.setQuantity(item.getQuantity());
            itemDTO.setPrice(item.getPrice());
            return itemDTO;
        }).collect(Collectors.toList());

        dto.setOrderItems(items);
        return dto;
    }
}
