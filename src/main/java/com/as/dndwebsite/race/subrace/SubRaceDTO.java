package com.as.dndwebsite.race.subrace;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.ImageDTO;

import java.util.List;
import java.util.Optional;

public record SubRaceDTO(EntryDTO subRace,
                         Optional<EntryDTO> race,
                         List<ImageDTO> images,
                         List<EntryDTO> regions) {
}
