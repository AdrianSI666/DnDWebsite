package com.as.dndwebsite.util;

import com.as.dndwebsite.image.Image;
import com.as.dndwebsite.image.ImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Component
@RequiredArgsConstructor
public class ConvertToJpg implements ImageConverter {
    private final ImageRepository imageRepository;

    public Image convert(MultipartFile file, byte[] image) throws IOException {
        try (ByteArrayInputStream bais = new ByteArrayInputStream(image)) {
            BufferedImage bufferedImage = ResizeImage.resize(ImageIO.read(bais), 1280, 720);
            BufferedImage newBufferedImage = new BufferedImage(
                    bufferedImage.getWidth(),
                    bufferedImage.getHeight(),
                    BufferedImage.TYPE_INT_RGB);
            newBufferedImage.createGraphics()
                    .drawImage(bufferedImage,
                            0,
                            0,
                            Color.WHITE,
                            null);
            try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
                ImageIO.write(newBufferedImage, "jpg", baos);
                String fileName = file.getOriginalFilename();
                if (fileName != null) {
                    int pos = fileName.lastIndexOf(".");
                    if (pos != -1) fileName = fileName.substring(0, pos);
                } else {
                    fileName = "No name";
                }
                return imageRepository.save(new Image(baos.toByteArray(), fileName));
            }
        }
    }
}
