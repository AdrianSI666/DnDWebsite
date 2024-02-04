package com.as.dndwebsite.race;

import com.as.dndwebsite.dto.EntryDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RaceRepository extends JpaRepository<Race, Long> {
    Optional<EntryDTO> findByName(String name);
    Optional<EntryDTO> findBySubRaces_Id(long id);
    List<EntryDTO> findAllByRegions_Id(Long id);
    Page<EntryDTO> findAllByRegions_Name(String name, Pageable paging);
    Page<EntryDTO> findAllBySubRaces_Name(String name, Pageable paging);
    Optional<EntryDTO> findBySubRaces_Name(String name);
}