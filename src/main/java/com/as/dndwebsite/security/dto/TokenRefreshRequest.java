package com.as.dndwebsite.security.dto;

public record TokenRefreshRequest(
        String token,
        String refreshToken
) {
}
