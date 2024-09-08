package com.as.dndwebsite.security.dto;

public record LoginRequest(
        String email,
        String password
) {
}
