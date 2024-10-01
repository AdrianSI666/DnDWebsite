package com.as.dndwebsite.creatures.types.species;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ISpeciesService {
    Page<EntryDTO> getSpecies(PageInfo page);

    SpeciesDTO getSpecies(String name);

    EntryDTO saveSpecies(EntryDTO species);

    void updateSpecies(EntryDTO species, Long id);

    void deleteSpecies(Long id);

    List<EntryDTO> getAllSpeciess();
}
