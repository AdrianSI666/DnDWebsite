package com.as.dndwebsite.maps;

import com.as.dndwebsite.dto.ImageDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IWorldImageService {
    List<ImageDTO> getImagesOfWorld(long id);

    ImageDTO saveImageToWorld(MultipartFile file, Long id);

    void deleteImageFromWorld(Long worldId, Long imageId);
}
