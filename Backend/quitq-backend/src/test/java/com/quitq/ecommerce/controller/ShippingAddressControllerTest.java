package com.quitq.ecommerce.controller;

import com.quitq.ecommerce.dto.ShippingAddressDTO;
import com.quitq.ecommerce.service.ShippingAddressService;
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

import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class ShippingAddressControllerTest {

    @Mock
    private ShippingAddressService shippingAddressService;

    @InjectMocks
    private ShippingAddressController shippingAddressController;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        // Set up MockMvc with standalone controller
        mockMvc = MockMvcBuilders.standaloneSetup(shippingAddressController).build();

        // Mock SecurityContextHolder to simulate an authenticated user
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken("test@example.com", null);
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }



    @Test
    void getShippingAddresses_Success() throws Exception {
        ShippingAddressDTO shippingAddressDTO = new ShippingAddressDTO();
        shippingAddressDTO.setId(1L);
        shippingAddressDTO.setAddressLine1("123 Main St");
        shippingAddressDTO.setCity("New York");
        shippingAddressDTO.setState("NY");
        shippingAddressDTO.setPostalCode("10001");
        shippingAddressDTO.setCountry("USA");

        when(shippingAddressService.getUserIdByEmail("test@example.com")).thenReturn(1L);
        when(shippingAddressService.getShippingAddresses(1L)).thenReturn(Collections.singletonList(shippingAddressDTO));

        mockMvc.perform(get("/api/shipping-addresses")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].addressLine1").value("123 Main St"))
                .andExpect(jsonPath("$[0].city").value("New York"))
                .andExpect(jsonPath("$[0].state").value("NY"))
                .andExpect(jsonPath("$[0].postalCode").value("10001"))
                .andExpect(jsonPath("$[0].country").value("USA"));
    }


    @Test
    void deleteShippingAddress_Success() throws Exception {
        when(shippingAddressService.getUserIdByEmail("test@example.com")).thenReturn(1L);
        doNothing().when(shippingAddressService).deleteShippingAddress(1L, 1L);

        mockMvc.perform(delete("/api/shipping-addresses/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("Shipping address deleted successfully"));
    }
}