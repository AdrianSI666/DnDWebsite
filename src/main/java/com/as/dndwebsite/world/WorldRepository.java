package com.as.dndwebsite.world;

import com.as.dndwebsite.dto.EntryDTO;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WorldRepository extends JpaRepository<World, Long> {
    Optional<World> findByName(String name);

    Optional<EntryDTO> findByPlanes_Id(long id);

    Optional<EntryDTO> findByPlanes_Name(String name);

    Optional<EntryDTO> findByCultures_Name(String name);

    Optional<EntryDTO> findByCultures_Id(Long id);

    Optional<EntryDTO> findByContinents_Name(String name);

    Optional<EntryDTO> findByContinents_Id(Long id);

    Optional<EntryDTO> findByRegions_Name(String name);

    Optional<EntryDTO> findByRegions_Id(Long id);

    Optional<EntryDTO> findByPlaces_Name(String name);

    Optional<EntryDTO> findByPlaces_Id(Long id);

    Optional<EntryDTO> findByKingdoms_Name(String name);

    Optional<EntryDTO> findByKingdoms_Id(Long id);

    Optional<EntryDTO> findByCounties_Name(String name);

    Optional<EntryDTO> findByCounties_Id(Long id);

    Optional<EntryDTO> findBySpecies_Name(String name);

    Optional<EntryDTO> findBySpecies_Id(Long id);

    Optional<EntryDTO> findByCreatureTypes_Id(Long id);

    Optional<EntryDTO> findByCreatureTypes_Name(String name);

    Optional<EntryDTO> findBySubSpecies_Name(String name);

    Optional<EntryDTO> findBySubSpecies_Id(Long id);
}
