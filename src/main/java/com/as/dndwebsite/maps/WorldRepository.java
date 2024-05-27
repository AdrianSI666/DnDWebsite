package com.as.dndwebsite.maps;

import com.as.dndwebsite.dto.EntryDTO;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WorldRepository extends JpaRepository<World, Long> {
    Optional<EntryDTO> findByName(String name);

    Optional<EntryDTO> findByPlanes_Id(long id);

    Optional<EntryDTO> findByPlanes_Name(String name);
}
