package com.as.dndwebsite.security;

public record RegisterRequest(
        String name,
        String email,
        String password
) {
}
