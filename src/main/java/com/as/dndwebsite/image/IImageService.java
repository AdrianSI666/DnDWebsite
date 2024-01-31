package com.as.dndwebsite.image;

import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.dto.ImageDTO;
import org.springframework.web.multipart.MultipartFile;

public interface IImageService {
    ImageDTO saveImageToEntry(MultipartFile file, Entry entry);

    void deleteImageFromEntry(Entry entry, Long imageId);
}
