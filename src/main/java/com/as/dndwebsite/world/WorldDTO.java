package com.as.dndwebsite.world;

import com.as.dndwebsite.dto.DescriptionDTO;
import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.ImageDTO;

import java.util.List;

public record WorldDTO(EntryDTO world,
                       List<DescriptionDTO> descriptions,
                       List<ImageDTO> images) {
}
