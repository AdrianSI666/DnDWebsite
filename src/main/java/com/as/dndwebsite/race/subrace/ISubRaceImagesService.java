package com.as.dndwebsite.race.subrace;

import com.as.dndwebsite.dto.ImageDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ISubRaceImagesService {
    List<ImageDTO> getImagesOfSubRace(long id);

    ImageDTO saveImageToSubRace(MultipartFile file, Long id);

    void deleteImageFromSubRace(Long raceId, Long imageId);
}
