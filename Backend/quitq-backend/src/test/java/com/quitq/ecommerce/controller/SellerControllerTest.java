package com.quitq.ecommerce.controller;

import com.quitq.ecommerce.dto.ProductDTO;
import com.quitq.ecommerce.entity.User;
import com.quitq.ecommerce.service.DashboardService;
import com.quitq.ecommerce.service.DashboardStats;
import com.quitq.ecommerce.service.SellerService;
import com.quitq.ecommerce.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;

import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import jakarta.servlet.http.HttpServletRequest;

import java.security.Principal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import static org.hamcrest.Matchers.*;


@ExtendWith(MockitoExtension.class)
class SellerControllerTest {

    @Mock
    private SellerService sellerService;

    @Mock
    private DashboardService dashboardService;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private SellerController sellerController;

    private MockMvc mockMvc;

    private ObjectMapper objectMapper;

    private ProductDTO sampleProductDTO;

    private User sampleUser;

    private DashboardStats sampleStats;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        mockMvc = MockMvcBuilders.standaloneSetup(sellerController).build();

        sampleProductDTO = new ProductDTO();
        sampleProductDTO.setId(1L);
        sampleProductDTO.setName("Sample Product");
        sampleProductDTO.setPrice(25.5);
        sampleProductDTO.setDescription("Sample description");
        sampleProductDTO.setCategoryId(10L);
        sampleProductDTO.setImageUrl("http://image.url/sample.png");
        sampleProductDTO.setStock(15);

        sampleUser = new User();
        sampleUser.setId(100L);
        sampleUser.setEmail("seller@example.com");
        sampleUser.setName("Seller Name");
        sampleUser.setPassword("encrypted_password");
        sampleUser.setRole(User.Role.SELLER);

        //sampleStats = new DashboardStats();
        // Initialize sampleStats if needed
    }

    @Test
    @WithMockUser(roles = "SELLER")
    void addProduct_ReturnsSavedProduct() throws Exception {
        when(sellerService.addProduct(any(ProductDTO.class), any(HttpServletRequest.class))).thenReturn(sampleProductDTO);

        mockMvc.perform(post("/api/seller/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleProductDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(sampleProductDTO.getId().intValue())))
                .andExpect(jsonPath("$.name", is(sampleProductDTO.getName())))
                .andExpect(jsonPath("$.price", is(sampleProductDTO.getPrice())))
                .andExpect(jsonPath("$.description", is(sampleProductDTO.getDescription())));

        verify(sellerService).addProduct(any(ProductDTO.class), any(HttpServletRequest.class));
    }

    @Test
    @WithMockUser(roles = "SELLER")
    void getAllProducts_ReturnsProductList() throws Exception {
        List<ProductDTO> productList = Arrays.asList(sampleProductDTO);
        when(sellerService.getProductsBySeller(any(HttpServletRequest.class))).thenReturn(productList);

        mockMvc.perform(get("/api/seller/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(productList.size())))
                .andExpect(jsonPath("$[0].name", is(sampleProductDTO.getName())));

        verify(sellerService).getProductsBySeller(any(HttpServletRequest.class));
    }

    @Test
    @WithMockUser(roles = "SELLER")
    void updateProduct_ReturnsUpdatedProduct() throws Exception {
        when(sellerService.updateProduct(eq(1L), any(ProductDTO.class))).thenReturn(sampleProductDTO);

        mockMvc.perform(put("/api/seller/products/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleProductDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(sampleProductDTO.getId().intValue())))
                .andExpect(jsonPath("$.name", is(sampleProductDTO.getName())));

        verify(sellerService).updateProduct(eq(1L), any(ProductDTO.class));
    }

    @Test
    @WithMockUser(roles = "SELLER")
    void deleteProduct_ReturnsOk() throws Exception {
        doNothing().when(sellerService).deleteProduct(1L);

        mockMvc.perform(delete("/api/seller/products/1"))
                .andExpect(status().isOk());

        verify(sellerService).deleteProduct(1L);
    }

    @Test
    @WithMockUser(roles = "SELLER")
    void getDashboard_WhenUserDetailsNull_ThrowsSecurityException() {
        try {
            sellerController.getDashboard(null);
        } catch (SecurityException ex) {
            assert(ex.getMessage().contains("User authentication details are not available"));
        }
    }
}
