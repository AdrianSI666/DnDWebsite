package com.as.dndwebsite.creatures.types;

import com.as.dndwebsite.dto.DescriptionDTO;
import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.ImageDTO;

import java.util.List;

public record CreatureTypeDTO(
        EntryDTO creatureType,
        List<EntryDTO> races,
        List<DescriptionDTO> descriptions,
        List<ImageDTO> images,
        List<EntryDTO> planes
) {
}
