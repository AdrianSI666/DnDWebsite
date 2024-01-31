package com.as.dndwebsite.util;

import com.as.dndwebsite.image.Image;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface ImageConverter {
    Image convert(MultipartFile file, byte[] image) throws IOException;
}
