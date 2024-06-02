package com.as.dndwebsite.dto;

import java.util.List;
import java.util.Optional;

public record EntryFullDTO(
        EntryDTO object,
        Optional<EntryDTO> domObjects,
        List<EntryDTO> subObjects,
        List<DescriptionDTO> descriptions,
        List<ImageDTO> images
) {

}
