package com.as.dndwebsite.race;

import com.as.dndwebsite.dto.ImageDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IRaceImagesService {
    List<ImageDTO> getImagesOfRace(long id);

    ImageDTO saveImageToRace(MultipartFile file, Long id);

    void deleteImageFromRace(Long raceId, Long imageId);
}
