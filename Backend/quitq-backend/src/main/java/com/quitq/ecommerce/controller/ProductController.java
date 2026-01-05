package com.quitq.ecommerce.controller;

import com.quitq.ecommerce.dto.ProductDTO;
import com.quitq.ecommerce.entity.Product;
import com.quitq.ecommerce.service.ProductService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);

    @Autowired
    private ProductService productService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductDTO> addProduct(@Valid @RequestBody ProductDTO productDTO) {
        logger.info("Request to add product: {}", productDTO);
        ProductDTO savedProduct = productService.addProduct(productDTO);
        logger.info("Product added successfully with id: {}", savedProduct.getId());
        return ResponseEntity.ok(savedProduct);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SELLER', 'USER')")
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        logger.info("Request to get all products");
        List<ProductDTO> products = productService.getAllProducts();
        logger.info("Returning {} products", products.size());
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'SELLER', 'ADMIN')")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        logger.info("Request to get product by id: {}", id);
        ProductDTO productDTO = productService.findProductById(id);
        logger.info("Returning product with id: {}", id);
        return ResponseEntity.ok(productDTO);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductDTO productDTO) {
        logger.info("Request to update product with id: {} using data: {}", id, productDTO);
        ProductDTO updatedProduct = productService.updateProduct(id, productDTO);
        logger.info("Product updated successfully with id: {}", updatedProduct.getId());
        return ResponseEntity.ok(updatedProduct);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        logger.info("Request to delete product with id: {}", id);
        productService.deleteProduct(id);
        logger.info("Product with id: {} deleted successfully", id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/filter")
    @PreAuthorize("hasAnyRole('USER', 'SELLER', 'ADMIN')")
    public ResponseEntity<List<ProductDTO>> getProductsByCategoryAndSearch(
            @RequestParam(required = false) @Min(value = 1, message = "Category ID must be greater than or equal to 1") Long categoryId,
            @RequestParam(required = false) String name) {
        logger.info("Request to filter products by categoryId: {} and name: {}", categoryId, name);
        List<ProductDTO> filteredProducts = productService.getProductsByCategoryAndSearch(categoryId, name);
        logger.info("Returning {} filtered products", filteredProducts.size());
        return ResponseEntity.ok(filteredProducts);
    }

    @GetMapping("/search/name")
    @PreAuthorize("hasAnyRole('USER', 'SELLER', 'ADMIN')")
    public ResponseEntity<List<ProductDTO>> searchProductsByName(
            @RequestParam(required = false) String name) {
        logger.info("Request to search products by name: {}", name);
        List<Product> products = productService.searchProductsByName(name);
        List<ProductDTO> productDTOs = products.stream()
                .map(product -> {
                    ProductDTO dto = new ProductDTO();
                    dto.setId(product.getId());
                    dto.setName(product.getName());
                    dto.setPrice(product.getPrice());
                    dto.setDescription(product.getDescription());
                    dto.setCategoryId(product.getCategory() != null ? product.getCategory().getId() : null);
                    dto.setImageUrl(product.getImageUrl());
                    dto.setStock(product.getStock());
                    return dto;
                })
                .collect(Collectors.toList());
        logger.info("Returning {} products for name search", productDTOs.size());
        return ResponseEntity.ok(productDTOs);
    }
}
