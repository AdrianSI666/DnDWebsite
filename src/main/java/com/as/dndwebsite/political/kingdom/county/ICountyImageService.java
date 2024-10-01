package com.as.dndwebsite.political.kingdom.county;

import com.as.dndwebsite.dto.ImageDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ICountyImageService {
    List<ImageDTO> getImagesOfCounty(long id);

    ImageDTO saveImageToCounty(MultipartFile file, Long id);

    void deleteImageFromCounty(Long raceId, Long imageId);
}
