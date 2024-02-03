package com.as.dndwebsite.places.kingdom.region.place;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.ImageDTO;

import java.util.List;

public record PlaceDTO(
        EntryDTO place,
        EntryDTO region,
        List<ImageDTO> images,
        List<EntryDTO> races,
        List<EntryDTO> subRaces
) {
}
