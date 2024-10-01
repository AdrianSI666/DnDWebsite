package com.as.dndwebsite.geographic.plane.continent.region;

import com.as.dndwebsite.dto.EntryDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RegionRepository extends JpaRepository<Region, Long> {
    Optional<Region> findByName(String name);

    Optional<EntryDTO> findByPlaces_Id(Long id);

    Page<EntryDTO> findAllByCultures_Name(String name, Pageable paging);

    List<EntryDTO> findAllByCultures_Id(Long id);

    List<EntryDTO> findAllBySpecies_Id(Long id);

    List<EntryDTO> findAllBySubSpecies_Id(Long id);


    Optional<EntryDTO> findAllByPlaces_Name(String name);

    List<EntryDTO> findAllByWorldId(Long worldId);

    Page<EntryDTO> findAllByWorldName(String name, Pageable paging);

    List<EntryDTO> findAllByContinentId(Long continentId);

    Page<EntryDTO> findAllByContinentName(String name, Pageable paging);

    List<EntryDTO> findAllByContinentIdIsNull();

    List<EntryDTO> findAllByCounties_Id(Long countyId);

    Page<EntryDTO> findAllByCounties_Name(String name, Pageable paging);

    List<EntryDTO> findAllByCounties_IdIsNull();

    Page<EntryDTO> findAllBySubSpecies_Name(String name, Pageable paging);
}