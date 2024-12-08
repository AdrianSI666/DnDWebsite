package com.as.dndwebsite.creatures.types.species;

import com.as.dndwebsite.dto.DescriptionDTO;
import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.ImageDTO;

import java.util.List;
import java.util.Optional;

public record SpeciesDTO(
        Optional<EntryDTO> creatureType,
        EntryDTO species,
        List<EntryDTO> subSpecies,
        List<DescriptionDTO> descriptions,
        List<ImageDTO> images,
        List<EntryDTO> regions
) {
}
