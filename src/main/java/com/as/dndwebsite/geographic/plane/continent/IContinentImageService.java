package com.as.dndwebsite.geographic.plane.continent;

import com.as.dndwebsite.dto.ImageDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IContinentImageService {
    List<ImageDTO> getImagesOfContinent(long id);

    ImageDTO saveImageToContinent(MultipartFile file, Long id);

    void deleteImageFromContinent(Long raceId, Long imageId);
}
