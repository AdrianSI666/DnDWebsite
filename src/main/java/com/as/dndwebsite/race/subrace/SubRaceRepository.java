package com.as.dndwebsite.race.subrace;

import com.as.dndwebsite.dto.EntryDTO;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SubRaceRepository extends JpaRepository<SubRace, Long> {
    Optional<SubRace> findByName(String name);

    List<EntryDTO> findAllByRaceId(Long raceId);

    void deleteAllByRaceId(Long id);
}