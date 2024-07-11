package com.as.dndwebsite.security;

public record LoginRequest(
        String email,
        String password
) {
}
