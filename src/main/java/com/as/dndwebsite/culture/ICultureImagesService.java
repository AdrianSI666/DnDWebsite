package com.as.dndwebsite.culture;

import com.as.dndwebsite.dto.ImageDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ICultureImagesService {
    List<ImageDTO> getImagesOfCulture(long id);

    ImageDTO saveImageToCulture(MultipartFile file, Long id);

    void deleteImageFromCulture(Long raceId, Long imageId);
}
