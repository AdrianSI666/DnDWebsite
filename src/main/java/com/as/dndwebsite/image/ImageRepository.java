package com.as.dndwebsite.image;

import com.as.dndwebsite.dto.ImageDTO;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ImageRepository extends JpaRepository<Image, Long> {
    List<ImageDTO> findAllByCultures_Id(Long id);
    List<ImageDTO> findAllByWorlds_Id(Long id);
    List<ImageDTO> findAllByPlanes_Id(Long id);
    List<ImageDTO> findAllByContinents_Id(Long id);
    List<ImageDTO> findAllByKingdoms_Id(Long id);
    List<ImageDTO> findAllByRegions_Id(Long id);
    List<ImageDTO> findAllByPlaces_Id(Long id);

    List<ImageDTO> findAllByCounties_Id(long id);

    List<ImageDTO> findAllByCreatureTypes_Id(long id);

    List<ImageDTO> findAllBySpecies_Id(long id);

    List<ImageDTO> findAllBySubSpecies_Id(long id);
}