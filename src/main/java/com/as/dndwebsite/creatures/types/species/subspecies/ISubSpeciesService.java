package com.as.dndwebsite.creatures.types.species.subspecies;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.EntryDTOnWorldData;
import com.as.dndwebsite.dto.PageInfo;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ISubSpeciesService {
    Page<EntryDTOnWorldData> getSubSpecies(PageInfo page);

    List<EntryDTO> getAllSubSpecies(Long worldId);

    SubSpeciesDTO getSubSpeciesByName(String name);

    EntryDTO saveSubSpecies(EntryDTO entryDTO, Long worldId);

    void updateSubSpecies(EntryDTO entryDTO, Long id);

    void deleteSubSpecies(Long id);
}
