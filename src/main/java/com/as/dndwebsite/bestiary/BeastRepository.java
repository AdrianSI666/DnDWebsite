package com.as.dndwebsite.bestiary;

import com.as.dndwebsite.dto.EntryDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface BeastRepository extends JpaRepository<Beast,Long> {
    Optional<EntryDTO> findByName(String name);
    List<EntryDTO> findAllByRegions_Id(Long id);
    Page<EntryDTO> findAllByRegions_Name(String name, Pageable paging);
    //Page<EntryDTO> findAllByBeast_Name(String name,Pageable paging);
}
