
package com.quitq.ecommerce.service;

import com.quitq.ecommerce.dto.ProductDTO;
import com.quitq.ecommerce.entity.Category;
import com.quitq.ecommerce.entity.Product;
import com.quitq.ecommerce.exception.ResourceNotFoundException;
import com.quitq.ecommerce.repository.CategoryRepository;
import com.quitq.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public ProductDTO addProduct(ProductDTO productDTO) {
        if (productDTO.getCategoryId() == null) {
            throw new ResourceNotFoundException("Category ID is required");
        }

        Category category = categoryRepository.findById(productDTO.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + productDTO.getCategoryId()));

        Product product = new Product(
                productDTO.getName(),
                productDTO.getPrice(),
                productDTO.getDescription(),
                category,
                productDTO.getImageUrl(),
                productDTO.getStock() != null ? productDTO.getStock() : 0
        );

        Product savedProduct = productRepository.save(product);
        return convertToDTO(savedProduct);
    }

    public List<ProductDTO> getAllProducts() {
        List<Product> products = productRepository.findAll();
        return products.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
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

    private ProductDTO convertToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setPrice(product.getPrice());
        dto.setDescription(product.getDescription());
        dto.setCategoryId(product.getCategory() != null ? product.getCategory().getId() : null);
        dto.setImageUrl(product.getImageUrl());
        dto.setStock(product.getStock());


        if (product.getSeller() != null) {
            dto.setBusinessName(product.getSeller().getBusinessName());
        } else {
            dto.setBusinessName(null);
        }

        return dto;
    }

    public ProductDTO findProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));
        return convertToDTO(product);
    }

    public List<Product> getFilteredProducts(Long categoryId, Double minPrice) {
        if (categoryId != null && categoryId <= 0) {
            throw new IllegalArgumentException("Category ID must be greater than 0");
        }
        return productRepository.findByCategoryIdAndMinPrice(categoryId, minPrice);
    }

    public List<Product> searchProductsByName(String name) {
        if (name == null || name.trim().isEmpty()) {
            return productRepository.findAll();
        }
        return productRepository.findByNameContaining(name.trim());
    }


    public List<ProductDTO> getProductsByCategoryAndSearch(Long categoryId, String searchTerm) {
        List<Product> products;
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            products = productRepository.findByCategoryId(categoryId);
        } else {
            products = productRepository.findByCategoryIdAndNameContainingIgnoreCase(categoryId, searchTerm.trim());
        }
        return products.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
}

