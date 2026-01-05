package com.quitq.ecommerce.controller;

import com.quitq.ecommerce.dto.CartItemDTO;
import com.quitq.ecommerce.service.CartItemService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.test.context.support.WithMockUser;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

public class CartItemControllerTest {

    @Mock
    private CartItemService cartItemService;

    @InjectMocks
    private CartItemController cartItemController;

    @Mock
    private UserDetails userDetails;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @WithMockUser(roles = {"ADMIN", "SELLER", "USER"})
    void testAddToCart() {
        when(userDetails.getUsername()).thenReturn("user@example.com");

        CartItemDTO dto = new CartItemDTO();
        dto.setId(1L);
        dto.setProductId(100L);
        dto.setQuantity(2);

        when(cartItemService.addToCart(eq(100L), eq(2), eq("user@example.com"))).thenReturn(dto);

        ResponseEntity<CartItemDTO> response = cartItemController.addToCart(100L, 2, userDetails);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(1L, response.getBody().getId());
        verify(cartItemService, times(1)).addToCart(100L, 2, "user@example.com");
    }

    @Test
    @WithMockUser(roles = {"ADMIN", "SELLER", "USER"})
    void testGetCartItems() {
        when(userDetails.getUsername()).thenReturn("user@example.com");

        CartItemDTO dto = new CartItemDTO();
        dto.setId(1L);

        when(cartItemService.getCartItems("user@example.com")).thenReturn(List.of(dto));

        ResponseEntity<List<CartItemDTO>> response = cartItemController.getCartItems(userDetails);

        assertEquals(200, response.getStatusCodeValue());
        assertFalse(response.getBody().isEmpty());
        verify(cartItemService, times(1)).getCartItems("user@example.com");
    }

    @Test
    @WithMockUser(roles = {"ADMIN", "SELLER", "USER"})
    void testUpdateQuantity() {
        when(userDetails.getUsername()).thenReturn("user@example.com");

        doNothing().when(cartItemService).updateQuantity(100L, 5, "user@example.com");

        ResponseEntity<String> response = cartItemController.updateQuantity(100L, 5, userDetails);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Updated successfully", response.getBody());
        verify(cartItemService, times(1)).updateQuantity(100L, 5, "user@example.com");
    }

    @Test
    @WithMockUser(roles = {"ADMIN", "SELLER", "USER"})
    void testRemoveFromCart() {
        when(userDetails.getUsername()).thenReturn("user@example.com");

        doNothing().when(cartItemService).removeFromCart(1L, "user@example.com");

        ResponseEntity<String> response = cartItemController.removeFromCart(1L, userDetails);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Removed Successfully", response.getBody());
        verify(cartItemService, times(1)).removeFromCart(1L, "user@example.com");
    }

    @Test
    void testAddToCart_ThrowsSecurityExceptionWhenUserDetailsNull() {
        SecurityException exception = assertThrows(SecurityException.class, () ->
                cartItemController.addToCart(1L, 2, null));

        assertEquals("User authentication details are not available", exception.getMessage());
    }

    @Test
    void testGetCartItems_ThrowsSecurityExceptionWhenUserDetailsNull() {
        SecurityException exception = assertThrows(SecurityException.class, () ->
                cartItemController.getCartItems(null));

        assertEquals("User authentication details are not available", exception.getMessage());
    }

    @Test
    void testUpdateQuantity_ThrowsSecurityExceptionWhenUserDetailsNull() {
        SecurityException exception = assertThrows(SecurityException.class, () ->
                cartItemController.updateQuantity(1L, 2, null));

        assertEquals("User authentication details are not available", exception.getMessage());
    }

    @Test
    void testRemoveFromCart_ThrowsSecurityExceptionWhenUserDetailsNull() {
        SecurityException exception = assertThrows(SecurityException.class, () ->
                cartItemController.removeFromCart(1L, null));

        assertEquals("User authentication details are not available", exception.getMessage());
    }
}

