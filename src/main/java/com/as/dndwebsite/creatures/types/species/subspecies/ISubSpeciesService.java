package com.as.dndwebsite.creatures.types.species.subspecies;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ISubSpeciesService {
    Page<EntryDTO> getSubSpecies(PageInfo page);

    List<EntryDTO> getAllSubSpecies();

    SubSpeciesDTO getSubSpeciesByName(String name);

    EntryDTO saveSubSpecies(EntryDTO entryDTO);

    void updateSubSpecies(EntryDTO entryDTO, Long id);

    void deleteSubSpecies(Long id);
}
