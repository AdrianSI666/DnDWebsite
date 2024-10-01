package com.as.dndwebsite.geographic.plane.continent.region.place;

import com.as.dndwebsite.dto.EntryDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PlaceRepository extends JpaRepository<Place, Long> {
    Optional<Place> findByName(String name);

    Page<EntryDTO> findAllByRegionName(String name, Pageable pageable);

    List<EntryDTO> findAllByRegionId(Long id);

    List<EntryDTO> findAllByRegionIdIsNull();

    List<EntryDTO> findAllByWorldId(Long worldId);

    Page<EntryDTO> findAllByWorldName(String name, Pageable paging);
}