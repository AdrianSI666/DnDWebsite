package com.as.dndwebsite.maps.plane.continent.kingdom;

import com.as.dndwebsite.dto.EntryDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface KingdomRepository extends JpaRepository<Kingdom, Long> {
    Optional<EntryDTO> findByName(String name);
    Optional<EntryDTO> findByRegions_Id(long id);
    Page<EntryDTO> findAllByContinentName(String name, Pageable pageable);
    List<EntryDTO> findAllByContinentId(Long id);
    Optional<EntryDTO> findByRegions_Name(String name);
}