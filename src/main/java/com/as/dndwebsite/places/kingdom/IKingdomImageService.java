package com.as.dndwebsite.places.kingdom;

import com.as.dndwebsite.dto.ImageDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IKingdomImageService {
    List<ImageDTO> getImagesOfKingdom(long id);

    ImageDTO saveImageToKingdom(MultipartFile file, Long id);

    void deleteImageFromKingdom(Long raceId, Long imageId);
}
