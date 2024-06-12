package com.as.dndwebsite.bestiary;

import com.as.dndwebsite.dto.ImageDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IBeastImageService {
    List<ImageDTO> getImagesOfBeast(long id);
    ImageDTO saveImageToBeast(MultipartFile file, Long id);
    void deleteImageFromBeast(Long beastId,Long imageId);
}
