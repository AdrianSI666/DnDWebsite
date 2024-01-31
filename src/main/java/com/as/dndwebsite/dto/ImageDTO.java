package com.as.dndwebsite.dto;

public record ImageDTO(
        Long id,
        String name,
        byte[] content
) {
}
