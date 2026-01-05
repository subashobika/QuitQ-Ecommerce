package com.quitq.ecommerce.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.quitq.ecommerce.dto.OrderItemDTO;
import com.quitq.ecommerce.service.OrderItemService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.*;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import static org.hamcrest.Matchers.*;

@ExtendWith(MockitoExtension.class)
class OrderItemControllerTest {

    @Mock
    private OrderItemService orderItemService;

    @InjectMocks
    private OrderItemController orderItemController;

    private MockMvc mockMvc;

    private ObjectMapper objectMapper;

    private List<OrderItemDTO> sampleOrderItemList;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();

        mockMvc = MockMvcBuilders.standaloneSetup(orderItemController).build();

        // Set mock authenticated user in SecurityContext
        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken("testuser@example.com", null, Collections.emptyList());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        OrderItemDTO item1 = new OrderItemDTO();
        item1.setId(1L);
        item1.setProductId(101L);
        item1.setQuantity(3);
        item1.setPrice(50.0);

        OrderItemDTO item2 = new OrderItemDTO();
        item2.setId(2L);
        item2.setProductId(102L);
        item2.setQuantity(1);
        item2.setPrice(100.0);

        sampleOrderItemList = Arrays.asList(item1, item2);
    }

    @Test
    void getAllOrderItems_ReturnsList() throws Exception {
        when(orderItemService.getUserIdByEmail("testuser@example.com")).thenReturn(10L);
        when(orderItemService.getOrderItemsByUserId(10L)).thenReturn(sampleOrderItemList);

        mockMvc.perform(get("/api/order-items")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(sampleOrderItemList.size())))
                .andExpect(jsonPath("$[0].id", is(sampleOrderItemList.get(0).getId().intValue())))
                .andExpect(jsonPath("$[0].productId", is(sampleOrderItemList.get(0).getProductId().intValue())))
                .andExpect(jsonPath("$[0].quantity", is(sampleOrderItemList.get(0).getQuantity())))
                .andExpect(jsonPath("$[0].price", is(sampleOrderItemList.get(0).getPrice())))
                .andExpect(jsonPath("$[1].id", is(sampleOrderItemList.get(1).getId().intValue())))
                .andExpect(jsonPath("$[1].productId", is(sampleOrderItemList.get(1).getProductId().intValue())));

        verify(orderItemService).getUserIdByEmail("testuser@example.com");
        verify(orderItemService).getOrderItemsByUserId(10L);
    }
}
