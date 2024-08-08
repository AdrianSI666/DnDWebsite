package com.as.dndwebsite.security.dto;

public record RegisterRequest(
        String name,
        String email,
        String password
) {
}
