package com.as.dndwebsite.dto;

import java.util.List;

public record EntryFullDTO(
        EntryDTO object,
        EntryDTO domObjects,
        List<EntryDTO> subObjects,
        List<ImageDTO> images
) {

}
