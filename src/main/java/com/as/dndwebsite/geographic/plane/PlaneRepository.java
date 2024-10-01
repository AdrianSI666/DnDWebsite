package com.as.dndwebsite.geographic.plane;

import com.as.dndwebsite.dto.EntryDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PlaneRepository extends JpaRepository<Plane, Long> {
    Optional<Plane> findByName(String name);

    Optional<EntryDTO> findByContinents_Id(long id);

    Optional<EntryDTO> findByContinents_Name(String name);

    Page<EntryDTO> findAllByWorldName(String name, Pageable pageable);

    List<EntryDTO> findAllByWorldId(Long worldId);

    List<EntryDTO> findAllByCreatureTypes_Id(Long planeId);

    Page<EntryDTO> findAllByCreatureTypes_Name(String name, Pageable paging);
}
