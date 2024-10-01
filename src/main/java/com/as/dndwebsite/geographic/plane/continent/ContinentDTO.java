package com.as.dndwebsite.geographic.plane.continent;

import com.as.dndwebsite.dto.DescriptionDTO;
import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.ImageDTO;

import java.util.List;
import java.util.Optional;

public record ContinentDTO(EntryDTO continent,
                           Optional<EntryDTO> plane,
                           List<EntryDTO> regions,
                           List<EntryDTO> kingdoms,
                           List<DescriptionDTO> descriptions,
                           List<ImageDTO> images) {
}
