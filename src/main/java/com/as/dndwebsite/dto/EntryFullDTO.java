package com.as.dndwebsite.dto;

import java.util.List;

public record EntryFullDTO(
        EntryDTO race,
        List<EntryDTO> subRaces,
        List<ImageDTO> images
) {

}
