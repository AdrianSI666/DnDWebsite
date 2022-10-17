package com.as.dndwebsite.util;

import com.as.dndwebsite.domain.Image;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface Converter {
    Image convert(MultipartFile file, byte[] image) throws IOException;
}
