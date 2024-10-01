package com.as.dndwebsite.political.kingdom.county;

import com.as.dndwebsite.dto.EntryDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CountyRepository extends JpaRepository<County, Long> {
    Optional<County> findByName(String name);
    List<EntryDTO> findAllByRegions_Id(long id);
    List<EntryDTO> findAllByRegions_Name(String name, Pageable pageable);
    Page<EntryDTO> findAllByKingdomName(String name, Pageable pageable);
    List<EntryDTO> findAllByKingdomId(Long id);
    List<EntryDTO> findAllByKingdomIdIsNull();

    List<EntryDTO> findAllByRegions_Name(String name);

    List<EntryDTO> findAllByWorldId(Long worldId);

    Page<EntryDTO> findAllByWorldName(String name, Pageable paging);
}
