package com.as.dndwebsite.places.kingdom.region;

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
}