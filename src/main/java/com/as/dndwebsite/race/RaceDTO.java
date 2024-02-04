package com.as.dndwebsite.race;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.ImageDTO;

import java.util.List;

public record RaceDTO(
        EntryDTO race,
        List<EntryDTO> subRaces,
        List<ImageDTO> images,
        List<EntryDTO> regions
) {
}
