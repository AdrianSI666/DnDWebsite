package com.as.dndwebsite.race;

import com.as.dndwebsite.dto.EntryDTO;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RaceRepository extends JpaRepository<Race, Long> {
    Optional<EntryDTO> findByName(String name);
}