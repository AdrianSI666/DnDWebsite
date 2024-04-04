package com.as.dndwebsite.race.subrace;

import com.as.dndwebsite.dto.EntryDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SubRaceRepository extends JpaRepository<SubRace, Long> {
    Optional<EntryDTO> findByName(String name);

    Page<EntryDTO> findAllByRaceName(String name, Pageable pageable);

    List<EntryDTO> findAllByRegions_Id(Long id);

    Page<EntryDTO> findAllByRegions_Name(String name, Pageable paging);

    List<EntryDTO> findAllByRaceId(Long id);
    List<EntryDTO> findAllByRaceIdIsNull();
}