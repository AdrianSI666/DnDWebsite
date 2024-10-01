package com.as.dndwebsite.creatures.types;

import com.as.dndwebsite.dto.EntryDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CreatureTypeRepository extends JpaRepository<CreatureType, Long> {
    Optional<CreatureType> findByName(String name);

    List<EntryDTO> findAllByPlanes_Id(Long planeId);

    Page<EntryDTO> findAllByPlanes_Name(String name, Pageable paging);

    Optional<EntryDTO> findBySpecies_Id(long id);

    Optional<EntryDTO> findBySpecies_Name(String name);

    Page<EntryDTO> findAllByWorldName(String name, Pageable paging);

    List<EntryDTO> findAllByWorldId(Long worldId);
}