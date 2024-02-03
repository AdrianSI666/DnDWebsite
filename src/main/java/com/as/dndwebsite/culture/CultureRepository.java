package com.as.dndwebsite.culture;

import com.as.dndwebsite.dto.EntryDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CultureRepository extends JpaRepository<Culture, Long> {
    Optional<Culture> findByName(String name);
    List<EntryDTO> findAllByRegions_Id(Long id);

    Page<EntryDTO> findAllByRegions_Name(String name, Pageable paging);
}