package com.as.dndwebsite.description;

import com.as.dndwebsite.dto.DescriptionDTO;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DescriptionRepository extends JpaRepository<Description, Long> {
    List<DescriptionDTO> findAllByRaces_IdOrderById(Long id);
    List<DescriptionDTO> findAllBySubRaces_IdOrderById(Long id);
    List<DescriptionDTO> findAllByCultures_IdOrderById(Long id);
    List<DescriptionDTO> findAllByWorlds_IdOrderById(Long id);
    List<DescriptionDTO> findAllByPlanes_IdOrderById(Long id);
    List<DescriptionDTO> findAllByContinents_Id(Long id);
    List<DescriptionDTO> findAllByKingdoms_IdOrderById(Long id);
    List<DescriptionDTO> findAllByRegions_IdOrderById(Long id);
    List<DescriptionDTO> findAllByPlaces_IdOrderById(Long id);

    //Adding beasts
    List<DescriptionDTO> findAllByBeasts_IdOrderById(Long id);
}
