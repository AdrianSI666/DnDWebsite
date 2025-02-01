package com.as.dndwebsite.world;

public record WorldNAuthorDTO(Long id,
                              String name,
                              String shortDescription,
                              long authorId,
                              String authorName) {
}
