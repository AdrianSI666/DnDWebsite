package com.as.dndwebsite.geographic.plane;

import com.as.dndwebsite.dto.DescriptionDTO;
import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.ImageDTO;

import java.util.List;

public record PlaneFullDTO(
        Long id,
        String name,
        String shortDescription,
        EntryDTO world,
        List<ImageDTO> images,
        List<DescriptionDTO> descriptions,
        List<EntryDTO> continents
) {
}
