package com.as.dndwebsite.creatures.types.species.subspecies;

import com.as.dndwebsite.dto.EntryDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SubSpeciesRepository extends JpaRepository<SubSpecies, Long> {
    Optional<SubSpecies> findByName(String name);

    Page<EntryDTO> findAllBySpeciesName(String name, Pageable pageable);

    List<EntryDTO> findAllByRegions_Id(Long id);

    Page<EntryDTO> findAllByRegions_Name(String name, Pageable paging);

    List<EntryDTO> findAllBySpeciesId(Long id);
    List<EntryDTO> findAllBySpeciesIdIsNull();

    List<EntryDTO> findAllByWorldId(Long worldId);

    Page<EntryDTO> findAllByWorldName(String name, Pageable paging);
}