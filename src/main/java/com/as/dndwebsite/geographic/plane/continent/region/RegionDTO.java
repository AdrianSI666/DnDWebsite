package com.as.dndwebsite.geographic.plane.continent.region;

import com.as.dndwebsite.dto.DescriptionDTO;
import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.ImageDTO;

import java.util.List;
import java.util.Optional;

public record RegionDTO(
        EntryDTO region,
        Optional<EntryDTO> continent,
        List<EntryDTO> places,
        List<DescriptionDTO> descriptions,
        List<ImageDTO> images,
        List<EntryDTO> cultures,
        List<EntryDTO> species,
        List<EntryDTO> subSpecies,
        List<EntryDTO> counties
) {
}
