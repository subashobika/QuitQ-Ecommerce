package com.quitq.ecommerce.controller;

import com.quitq.ecommerce.dto.ShippingAddressDTO;
import com.quitq.ecommerce.service.ShippingAddressService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shipping-addresses")
public class ShippingAddressController {

    private static final Logger logger = LoggerFactory.getLogger(ShippingAddressController.class);

    @Autowired
    private ShippingAddressService shippingAddressService;

    @PostMapping
    public ResponseEntity<ShippingAddressDTO> addShippingAddress(@Valid @RequestBody ShippingAddressDTO shippingAddressDTO) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        logger.info("User with email: {} requested to add new shipping address: {}", email, shippingAddressDTO);
        Long userId = shippingAddressService.getUserIdByEmail(email);
        ShippingAddressDTO savedAddress = shippingAddressService.addShippingAddress(userId, shippingAddressDTO);
        logger.info("Shipping address added successfully for userId: {} with addressId: {}", userId, savedAddress.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(savedAddress);
    }

    @GetMapping
    public ResponseEntity<List<ShippingAddressDTO>> getShippingAddresses() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        logger.info("User with email: {} requested to get all shipping addresses", email);
        Long userId = shippingAddressService.getUserIdByEmail(email);
        List<ShippingAddressDTO> addresses = shippingAddressService.getShippingAddresses(userId);
        logger.info("Returning {} shipping addresses for userId: {}", addresses.size(), userId);
        return ResponseEntity.ok(addresses);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ShippingAddressDTO> updateShippingAddress(@PathVariable Long id, @Valid @RequestBody ShippingAddressDTO shippingAddressDTO) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        logger.info("User with email: {} requested to update shipping address with id: {} using data: {}", email, id, shippingAddressDTO);
        Long userId = shippingAddressService.getUserIdByEmail(email);
        ShippingAddressDTO updatedAddress = shippingAddressService.updateShippingAddress(id, userId, shippingAddressDTO);
        logger.info("Shipping address with id: {} updated successfully for userId: {}", id, userId);
        return ResponseEntity.ok(updatedAddress);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteShippingAddress(@PathVariable Long id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        logger.info("User with email: {} requested to delete shipping address with id: {}", email, id);
        Long userId = shippingAddressService.getUserIdByEmail(email);
        shippingAddressService.deleteShippingAddress(id, userId);
        logger.info("Shipping address with id: {} deleted successfully for userId: {}", id, userId);
        return ResponseEntity.ok("Shipping address deleted successfully");
    }
}
