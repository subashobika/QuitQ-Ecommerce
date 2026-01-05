package com.quitq.ecommerce.controller;

import com.quitq.ecommerce.dto.ProductDTO;
import com.quitq.ecommerce.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.security.test.context.support.WithMockUser;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

public class ProductControllerTest {

    @Mock
    private ProductService productService;

    @InjectMocks
    private ProductController productController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testAddProduct() {
        ProductDTO inputDTO = new ProductDTO();
        inputDTO.setName("Test Product");
        inputDTO.setPrice(10.0);
        inputDTO.setDescription("Desc");
        inputDTO.setCategoryId(1L);
        inputDTO.setStock(5);

        ProductDTO savedDTO = new ProductDTO();
        savedDTO.setId(1L);
        savedDTO.setName("Test Product");

        when(productService.addProduct(any(ProductDTO.class))).thenReturn(savedDTO);

        ResponseEntity<ProductDTO> response = productController.addProduct(inputDTO);

        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
        assertEquals("Test Product", response.getBody().getName());
        verify(productService, times(1)).addProduct(any(ProductDTO.class));
    }

    @Test
    @WithMockUser(roles = {"ADMIN","SELLER","USER"})
    void testGetAllProducts() {
        ProductDTO dto = new ProductDTO();
        dto.setId(1L);
        dto.setName("Prod1");

        when(productService.getAllProducts()).thenReturn(List.of(dto));

        ResponseEntity<List<ProductDTO>> response = productController.getAllProducts();

        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        verify(productService, times(1)).getAllProducts();
    }

    @Test
    @WithMockUser(roles = {"ADMIN","SELLER","USER"})
    void testGetProductById() {
        ProductDTO dto = new ProductDTO();
        dto.setId(1L);
        dto.setName("Prod1");

        when(productService.findProductById(1L)).thenReturn(dto);

        ResponseEntity<ProductDTO> response = productController.getProductById(1L);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Prod1", response.getBody().getName());
        verify(productService, times(1)).findProductById(1L);
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testUpdateProduct() {
        ProductDTO inputDTO = new ProductDTO();
        inputDTO.setName("Updated Prod");

        ProductDTO updatedDTO = new ProductDTO();
        updatedDTO.setId(1L);
        updatedDTO.setName("Updated Prod");

        when(productService.updateProduct(eq(1L), any(ProductDTO.class))).thenReturn(updatedDTO);

        ResponseEntity<ProductDTO> response = productController.updateProduct(1L, inputDTO);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Updated Prod", response.getBody().getName());
        verify(productService, times(1)).updateProduct(eq(1L), any(ProductDTO.class));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testDeleteProduct() {
        doNothing().when(productService).deleteProduct(1L);

        ResponseEntity<Void> response = productController.deleteProduct(1L);

        assertEquals(200, response.getStatusCodeValue());
        verify(productService, times(1)).deleteProduct(1L);
    }

    @Test
    @WithMockUser(roles = {"ADMIN","SELLER","USER"})
    void testGetProductsByCategoryAndSearch() {
        ProductDTO dto = new ProductDTO();
        dto.setId(1L);
        dto.setName("Filtered Prod");

        when(productService.getProductsByCategoryAndSearch(eq(1L), eq("test"))).thenReturn(List.of(dto));

        ResponseEntity<List<ProductDTO>> response = productController.getProductsByCategoryAndSearch(1L, "test");

        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        verify(productService, times(1)).getProductsByCategoryAndSearch(1L, "test");
    }

    @Test
    @WithMockUser(roles = {"ADMIN","SELLER","USER"})
    void testSearchProductsByName() {
        ProductDTO dto = new ProductDTO();
        dto.setId(1L);
        dto.setName("Searched Prod");

        when(productService.searchProductsByName("search")).thenReturn(List.of());

        ResponseEntity<List<ProductDTO>> response = productController.searchProductsByName("search");

        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
        verify(productService, times(1)).searchProductsByName("search");
    }
}
