package com.as.dndwebsite.creatures.types.species;

import com.as.dndwebsite.dto.ImageDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ISpeciesImagesService {
    List<ImageDTO> getImagesOfSpecies(long id);

    ImageDTO saveImageToSpecies(MultipartFile file, Long id);

    void deleteImageFromSpecies(Long speciesId, Long imageId);
}
