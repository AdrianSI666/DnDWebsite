package com.as.dndwebsite.race.subrace;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.ImageDTO;

import java.util.List;

public record SubRaceDTO(EntryDTO subRace,
                         EntryDTO race,
                         List<ImageDTO> images,
                         List<EntryDTO> regions) {
}
