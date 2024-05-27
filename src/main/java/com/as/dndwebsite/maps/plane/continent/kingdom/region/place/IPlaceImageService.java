package com.as.dndwebsite.maps.plane.continent.kingdom.region.place;

import com.as.dndwebsite.dto.ImageDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IPlaceImageService {
    List<ImageDTO> getImagesOfPlace(long id);

    ImageDTO saveImageToPlace(MultipartFile file, Long id);

    void deleteImageFromPlace(Long placeId, Long imageId);
}
