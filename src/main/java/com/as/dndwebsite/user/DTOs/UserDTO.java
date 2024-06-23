package com.as.dndwebsite.user.DTOs;

public record UserDTO(
        Long Id,
        String userName,
        String email,
        String password
) {
}
