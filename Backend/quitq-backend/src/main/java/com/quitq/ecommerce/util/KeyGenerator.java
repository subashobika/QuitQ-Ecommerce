package com.quitq.ecommerce.util;

import io.jsonwebtoken.security.Keys;

import java.util.Base64;

public class KeyGenerator {
    public static void main(String[] args) {
        // Generate a 256-bit (32-byte) secure key for HS256
        byte[] keyBytes = Keys.secretKeyFor(io.jsonwebtoken.SignatureAlgorithm.HS256).getEncoded();
        String base64Key = Base64.getEncoder().encodeToString(keyBytes);
        System.out.println("New JWT Secret (Base64): " + base64Key);
    }
}
