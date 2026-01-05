package com.quitq.ecommerce.service;

import com.quitq.ecommerce.dto.ShippingAddressDTO;
import com.quitq.ecommerce.entity.ShippingAddress;
import com.quitq.ecommerce.entity.User;
import com.quitq.ecommerce.exception.ResourceNotFoundException;
import com.quitq.ecommerce.repository.ShippingAddressRepository;
import com.quitq.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ShippingAddressService {

    @Autowired
    private ShippingAddressRepository shippingAddressRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public ShippingAddressDTO addShippingAddress(Long userId, ShippingAddressDTO shippingAddressDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        ShippingAddress address = new ShippingAddress(
                shippingAddressDTO.getAddressLine1(),
                shippingAddressDTO.getAddressLine2(),
                shippingAddressDTO.getCity(),
                shippingAddressDTO.getState(),
                shippingAddressDTO.getPostalCode(),
                shippingAddressDTO.getCountry(),
                user
        );

        ShippingAddress savedAddress = shippingAddressRepository.save(address);
        return convertToDTO(savedAddress);
    }

    @Transactional(readOnly = true)
    public List<ShippingAddressDTO> getShippingAddresses(Long userId) {
        List<ShippingAddress> addresses = shippingAddressRepository.findByUserId(userId);
        return addresses.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ShippingAddressDTO updateShippingAddress(Long id, Long userId, ShippingAddressDTO shippingAddressDTO) {
        ShippingAddress address = shippingAddressRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shipping address not found with ID: " + id));
        if (!address.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Unauthorized to update this address");
        }
        address.setAddressLine1(shippingAddressDTO.getAddressLine1());
        address.setAddressLine2(shippingAddressDTO.getAddressLine2());
        address.setCity(shippingAddressDTO.getCity());
        address.setState(shippingAddressDTO.getState());
        address.setPostalCode(shippingAddressDTO.getPostalCode());
        address.setCountry(shippingAddressDTO.getCountry());
        ShippingAddress updatedAddress = shippingAddressRepository.save(address);
        return convertToDTO(updatedAddress);
    }

    @Transactional
    public void deleteShippingAddress(Long id, Long userId) {
        ShippingAddress address = shippingAddressRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shipping address not found with ID: " + id));
        if (!address.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Unauthorized to delete this address");
        }
        shippingAddressRepository.delete(address);
    }

    public Long getUserIdByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return user.getId();
    }

    private ShippingAddressDTO convertToDTO(ShippingAddress address) {
        ShippingAddressDTO dto = new ShippingAddressDTO();
        dto.setId(address.getId());
        if (address.getUser() != null) {
            dto.setUserId(address.getUser().getId());
        }
        dto.setAddressLine1(address.getAddressLine1());
        dto.setAddressLine2(address.getAddressLine2());
        dto.setCity(address.getCity());
        dto.setState(address.getState());
        dto.setPostalCode(address.getPostalCode());
        dto.setCountry(address.getCountry());
        return dto;
    }
}