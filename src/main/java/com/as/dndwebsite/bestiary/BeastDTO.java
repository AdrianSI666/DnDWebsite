package com.as.dndwebsite.bestiary;

import com.as.dndwebsite.dto.DescriptionDTO;
import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.ImageDTO;

import java.util.List;

public record BeastDTO(
    EntryDTO beast,
    List<DescriptionDTO> description,
    List<ImageDTO>images,
    List<EntryDTO> regions
){
}
