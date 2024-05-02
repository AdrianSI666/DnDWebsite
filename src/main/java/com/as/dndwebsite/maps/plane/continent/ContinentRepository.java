package com.as.dndwebsite.maps.plane.continent;

import com.as.dndwebsite.dto.EntryDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ContinentRepository extends JpaRepository<Continent, Long> {
    Optional<EntryDTO> findByName(String name);
    Optional<EntryDTO> findByKingdoms_Id(long id);
    Optional<EntryDTO> findByKingdoms_Name(String name);
    Page<EntryDTO> findAllByPlaneName(String name, Pageable pageable);
    List<EntryDTO> findAllByPlaneId(Long planeId);
    List<EntryDTO> findAllByPlaneIdIsNull();
}