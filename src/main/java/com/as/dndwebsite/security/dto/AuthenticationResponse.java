package com.as.dndwebsite.security.dto;

public record AuthenticationResponse(
        String token,
        String refreshToken,
        Long userId//,
        //Collection<Role> roles
) {
}
