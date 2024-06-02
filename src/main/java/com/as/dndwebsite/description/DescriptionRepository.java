package com.as.dndwebsite.description;

import com.as.dndwebsite.dto.DescriptionDTO;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DescriptionRepository extends JpaRepository<Description, Long> {
    List<DescriptionDTO> findAllByRaces_Id(Long id);
    List<DescriptionDTO> findAllBySubRaces_Id(Long id);
    List<DescriptionDTO> findAllByCultures_Id(Long id);
    List<DescriptionDTO> findAllByWorlds_Id(Long id);
    List<DescriptionDTO> findAllByPlanes_Id(Long id);
    List<DescriptionDTO> findAllByContinents_Id(Long id);
    List<DescriptionDTO> findAllByKingdoms_Id(Long id);
    List<DescriptionDTO> findAllByRegions_Id(Long id);
    List<DescriptionDTO> findAllByPlaces_Id(Long id);
}
