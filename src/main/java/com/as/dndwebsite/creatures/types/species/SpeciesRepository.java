package com.as.dndwebsite.creatures.types.species;

import com.as.dndwebsite.dto.EntryDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SpeciesRepository extends JpaRepository<Species, Long> {
    Optional<Species> findByName(String name);
    Optional<EntryDTO> findBySubSpecies_Id(Long id);
    List<EntryDTO> findAllByRegions_Id(Long id);
    Page<EntryDTO> findAllByRegions_Name(String name, Pageable paging);
    Page<EntryDTO> findAllBySubSpecies_Name(String name, Pageable paging);
    Optional<EntryDTO> findBySubSpecies_Name(String name);

    Page<EntryDTO> findAllByCreatureTypeName(String name, Pageable paging);

    List<EntryDTO> findAllByCreatureTypeId(Long id);

    List<EntryDTO> findAllByCreatureTypeIdIsNull();

    List<EntryDTO> findAllByWorldId(Long worldId);

    Page<EntryDTO> findAllByWorldName(String name, Pageable paging);
}