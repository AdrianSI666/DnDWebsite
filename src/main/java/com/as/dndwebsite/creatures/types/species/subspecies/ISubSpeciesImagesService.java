package com.as.dndwebsite.creatures.types.species.subspecies;

import com.as.dndwebsite.dto.ImageDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ISubSpeciesImagesService {
    List<ImageDTO> getImagesOfSubSpecies(long id);

    ImageDTO saveImageToSubSpecies(MultipartFile file, Long id);

    void deleteImageFromSubSpecies(Long speciesId, Long imageId);
}
