package com.as.dndwebsite.geographic.plane;

import com.as.dndwebsite.dto.ImageDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IPlaneImagesService {
    List<ImageDTO> getImagesOfPlane(long id);

    ImageDTO saveImageToPlane(MultipartFile file, Long id);

    void deleteImageFromPlane(Long planeId, Long imageId);
}
