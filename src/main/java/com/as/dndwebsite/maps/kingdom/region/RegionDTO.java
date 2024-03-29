package com.as.dndwebsite.maps.kingdom.region;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.ImageDTO;

import java.util.List;

public record RegionDTO(
        EntryDTO region,
        EntryDTO kingdom,
        List<EntryDTO> places,
        List<ImageDTO> images,
        List<EntryDTO> cultures,
        List<EntryDTO> races,
        List<EntryDTO> subRaces
) {
}
