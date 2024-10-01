package com.as.dndwebsite.description;

import com.as.dndwebsite.dto.DescriptionDTO;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DescriptionRepository extends JpaRepository<Description, Long> {
    List<DescriptionDTO> findAllByCultures_IdOrderById(Long id);
    List<DescriptionDTO> findAllByWorlds_IdOrderById(Long id);
    List<DescriptionDTO> findAllByPlanes_IdOrderById(Long id);
    List<DescriptionDTO> findAllByContinents_Id(Long id);
    List<DescriptionDTO> findAllByKingdoms_IdOrderById(Long id);
    List<DescriptionDTO> findAllByRegions_IdOrderById(Long id);
    List<DescriptionDTO> findAllByPlaces_IdOrderById(Long id);

    List<DescriptionDTO> findAllByCounties_IdOrderById(long id);

    List<DescriptionDTO> findAllByCreatureTypes_IdOrderById(long id);

    List<DescriptionDTO> findAllBySpecies_IdOrderById(long id);

    List<DescriptionDTO> findAllBySubSpecies_IdOrderById(long id);
}
