package com.quitq.ecommerce.controller;

import com.quitq.ecommerce.dto.OrderDTO;
import com.quitq.ecommerce.service.OrderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.security.test.context.support.WithMockUser;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class OrderControllerTest {

    @Mock
    private OrderService orderService;

    @InjectMocks
    private OrderController orderController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @WithMockUser
    void testPlaceOrder() {
        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setId(1L);

        when(orderService.placeOrder(1L)).thenReturn(orderDTO);

        ResponseEntity<OrderDTO> response = orderController.placeOrder(1L);

        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
        assertEquals(1L, response.getBody().getId());
        verify(orderService, times(1)).placeOrder(1L);
    }

    @Test
    @WithMockUser
    void testGetOrders() {
        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setId(1L);

        when(orderService.getOrdersForCurrentUser()).thenReturn(List.of(orderDTO));

        ResponseEntity<List<OrderDTO>> response = orderController.getOrders();

        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        verify(orderService, times(1)).getOrdersForCurrentUser();
    }

    @Test
    @WithMockUser
    void testUpdateOrderStatus() {
        OrderDTO updatedOrder = new OrderDTO();
        updatedOrder.setId(1L);
        updatedOrder.setStatus("SHIPPED");

        when(orderService.updateOrderStatus(eq(1L), eq("SHIPPED"))).thenReturn(updatedOrder);

        ResponseEntity<OrderDTO> response = orderController.updateOrderStatus(1L, Map.of("status", "SHIPPED"));

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("SHIPPED", response.getBody().getStatus());
        verify(orderService, times(1)).updateOrderStatus(1L, "SHIPPED");
    }

    @Test
    void testUpdateOrderStatus_MissingStatus() {
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> orderController.updateOrderStatus(1L, Map.of()));

        assertEquals("Status is required", exception.getMessage());
        verify(orderService, never()).updateOrderStatus(anyLong(), anyString());
    }

    @Test
    @WithMockUser
    void testDeleteOrder() {
        doNothing().when(orderService).deleteOrder(1L);

        ResponseEntity<String> response = orderController.deleteOrder(1L);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Order deleted successfully", response.getBody());
        verify(orderService, times(1)).deleteOrder(1L);
    }
}

