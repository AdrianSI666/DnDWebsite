package com.as.dndwebsite.political.kingdom;

import com.as.dndwebsite.dto.DescriptionDTO;
import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.ImageDTO;

import java.util.List;

public record KingdomDTO(EntryDTO object,
                         List<EntryDTO> counties,
                         List<EntryDTO> continents,
                         List<DescriptionDTO> descriptions,
                         List<ImageDTO> images) {
}
