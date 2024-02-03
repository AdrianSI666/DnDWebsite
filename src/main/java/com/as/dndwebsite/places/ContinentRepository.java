package com.as.dndwebsite.places;

import com.as.dndwebsite.dto.EntryDTO;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ContinentRepository extends JpaRepository<Continent, Long> {
    Optional<EntryDTO> findByName(String name);
    Optional<EntryDTO> findByKingdoms_Id(long id);
}