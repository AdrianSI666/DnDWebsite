package com.as.dndwebsite.maps.plane.continent.kingdom.region;

import com.as.dndwebsite.dto.EntryDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RegionRepository extends JpaRepository<Region, Long> {
    Optional<EntryDTO> findByName(String name);

    List<EntryDTO> findAllByKingdomId(Long kingdomId);

    Page<EntryDTO> findAllByKingdomName(String name, Pageable paging);

    Optional<EntryDTO> findByPlaces_Id(Long id);

    Page<EntryDTO> findAllByCultures_Name(String name, Pageable paging);

    List<EntryDTO> findAllByCultures_Id(Long id);

    List<EntryDTO> findAllByRaces_Id(Long id);

    List<EntryDTO> findAllBySubRaces_Id(Long id);

    Page<EntryDTO> findAllBySubRaces_Name(String name, Pageable paging);

    Optional<EntryDTO> findAllByPlaces_Name(String name);
}