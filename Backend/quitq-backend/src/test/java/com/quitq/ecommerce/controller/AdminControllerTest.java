package com.quitq.ecommerce.controller;

import com.quitq.ecommerce.dto.OrderDTO;
import com.quitq.ecommerce.dto.UserDTO;
import com.quitq.ecommerce.service.DashboardService;
import com.quitq.ecommerce.service.DashboardStats;
import com.quitq.ecommerce.service.OrderService;
import com.quitq.ecommerce.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.security.test.context.support.WithMockUser;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

public class AdminControllerTest {

    @Mock
    private UserService userService;

    @Mock
    private OrderService orderService;

    @Mock
    private DashboardService dashboardService;

    @InjectMocks
    private AdminController adminController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllUsers() {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(1L);
        userDTO.setName("Test User");
        when(userService.getAllUsers()).thenReturn(List.of(userDTO));

        ResponseEntity<List<UserDTO>> response = adminController.getAllUsers();

        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        verify(userService, times(1)).getAllUsers();
    }

    @Test
    void testDeleteUser() {
        doNothing().when(userService).deleteUser(1L);

        ResponseEntity<Void> response = adminController.deleteUser(1L);

        assertEquals(200, response.getStatusCodeValue());
        verify(userService, times(1)).deleteUser(1L);
    }

    @Test
    void testGetOrders() {
        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setId(1L);
        when(orderService.getOrdersForCurrentUser()).thenReturn(List.of(orderDTO));

        ResponseEntity<List<OrderDTO>> response = adminController.getOrders();

        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        verify(orderService, times(1)).getOrdersForCurrentUser();
    }

    @Test
    void testUpdateOrderStatus() {
        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setId(1L);
        orderDTO.setStatus("SHIPPED");
        when(orderService.updateOrderStatus(anyLong(), anyString())).thenReturn(orderDTO);

        ResponseEntity<OrderDTO> response = adminController.updateOrderStatus(1L, "SHIPPED");

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("SHIPPED", response.getBody().getStatus());
        verify(orderService, times(1)).updateOrderStatus(1L, "SHIPPED");
    }


}
