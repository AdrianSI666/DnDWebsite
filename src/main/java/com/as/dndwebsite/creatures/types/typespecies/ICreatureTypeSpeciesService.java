package com.as.dndwebsite.creatures.types.typespecies;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

public interface ICreatureTypeSpeciesService {
    Page<EntryDTO> getSpeciesOfCreatureType(String name, PageInfo page);

    List<EntryDTO> getSpeciesOfCreatureType(Long id);
    List<EntryDTO> getAllSpeciesWithoutCreatureType();

    Optional<EntryDTO> getCreatureTypeOfSpecies(long id);

    EntryDTO addNewSpeciesCreatureTypeRelation(Long creatureTypeId, EntryDTO species);

    EntryDTO addNewCreatureTypeSpeciesRelation(Long speciesId, EntryDTO creatureType);

    void addSpeciesCreatureTypeRelation(Long creatureTypeId, Long speciesId);

    void removeSpeciesCreatureTypeRelation(Long creatureTypeId, Long speciesId);

    EntryDTO getCreatureTypeOfSpecies(String name);
}
