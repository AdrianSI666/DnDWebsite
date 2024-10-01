package com.as.dndwebsite.creatures.types;

import com.as.dndwebsite.dto.ImageDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ICreatureTypeImagesService {
    List<ImageDTO> getImagesOfCreatureType(long id);

    ImageDTO saveImageToCreatureType(MultipartFile file, Long id);

    void deleteImageFromCreatureType(Long creatureTypeId, Long imageId);
}
