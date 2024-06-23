package com.as.dndwebsite.user.DTOs;

import java.time.ZonedDateTime;

public record UserInfoDTO(
        Long id,
        String userName,
        String email,
        String password,
        ZonedDateTime createdAt,
        boolean isVerified,
        boolean isEnabled
) {
}
