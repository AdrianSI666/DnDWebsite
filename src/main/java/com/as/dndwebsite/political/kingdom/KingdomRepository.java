package com.as.dndwebsite.political.kingdom;

import com.as.dndwebsite.dto.EntryDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface KingdomRepository extends JpaRepository<Kingdom, Long> {
    Optional<Kingdom> findByName(String name);
    Page<EntryDTO> findAllByContinents_Name(String name, Pageable pageable);
    List<EntryDTO> findAllByContinents_Id(Long id);
    List<EntryDTO> findAllByContinents_IdIsNull();

    Optional<EntryDTO> findByCounties_Id(Long id);

    Optional<EntryDTO> findByCounties_Name(String name);

    List<EntryDTO> findAllByWorldId(Long worldId);

    Page<EntryDTO> findAllByWorldName(String name, Pageable paging);
}