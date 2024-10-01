package com.as.dndwebsite.creatures.types.species.subspecies;

import com.as.dndwebsite.dto.DescriptionDTO;
import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.ImageDTO;

import java.util.List;
import java.util.Optional;

public record SubSpeciesDTO(EntryDTO subSpecies,
                         Optional<EntryDTO> species,
                         List<DescriptionDTO> descriptions,
                         List<ImageDTO> images,
                         List<EntryDTO> regions) {
}
