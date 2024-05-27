package com.as.dndwebsite.maps.plane.continent.kingdom.region;

import com.as.dndwebsite.dto.ImageDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IRegionImageService {
    List<ImageDTO> getImagesOfRegion(long id);

    ImageDTO saveImageToRegion(MultipartFile file, Long id);

    void deleteImageFromRegion(Long raceId, Long imageId);
}
