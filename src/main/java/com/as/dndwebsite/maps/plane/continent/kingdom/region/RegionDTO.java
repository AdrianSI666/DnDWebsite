package com.as.dndwebsite.maps.plane.continent.kingdom.region;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.ImageDTO;

import java.util.List;
import java.util.Optional;

public record RegionDTO(
        EntryDTO region,
        Optional<EntryDTO> kingdom,
        List<EntryDTO> places,
        List<ImageDTO> images,
        List<EntryDTO> cultures,
        List<EntryDTO> races,
        List<EntryDTO> subRaces
) {
}
