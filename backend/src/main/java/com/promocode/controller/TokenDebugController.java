package com.promocode.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;
import java.util.Map;

@RestController
@RequestMapping("/api/debug")
@CrossOrigin(origins = "http://localhost:4200")
public class TokenDebugController {

    private static final Logger log = LoggerFactory.getLogger(TokenDebugController.class);

    @GetMapping("/token")
    public Map<String, Object> debugToken(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return Map.of("error", "No Bearer token found in Authorization header");
        }

        try {
            String token = authHeader.substring(7);
            // JWT has 3 parts: header.payload.signature
            String[] parts = token.split("\\.");
            if (parts.length < 2) {
                return Map.of("error", "Invalid JWT token format");
            }

            // Decode the payload (second part)
            String payload = new String(Base64.getUrlDecoder().decode(parts[1]));

            log.info("JWT Payload: {}", payload);

            return Map.of(
                "success", true,
                "payload", payload,
                "message", "Check backend logs for full token details"
            );
        } catch (Exception e) {
            log.error("Error decoding token", e);
            return Map.of("error", "Failed to decode token: " + e.getMessage());
        }
    }
}
