package com.as.dndwebsite.creatures.types.species.speciessubspecies;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

public interface ISpeciesSubSpeciesService {
    Page<EntryDTO> getSubSpeciesOfSpecies(String name, PageInfo page);

    List<EntryDTO> getSubSpeciesOfSpecies(Long id);
    List<EntryDTO> getAllSubSpeciesWithoutSpecies();

    Optional<EntryDTO> getSpeciesOfSubSpecies(long id);

    EntryDTO addNewSubSpeciesSpeciesRelation(Long speciesId, EntryDTO subSpecies);

    EntryDTO addNewSpeciesSubSpeciesRelation(Long subSpeciesId, EntryDTO species);

    void addSubSpeciesSpeciesRelation(Long speciesId, Long subSpeciesId);

    void removeSubSpeciesSpeciesRelation(Long speciesId, Long subSpeciesId);

    EntryDTO getSpeciesOfSubSpecies(String name);
}
