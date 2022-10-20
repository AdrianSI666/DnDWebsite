package com.as.dndwebsite.util;

import com.as.dndwebsite.domain.Image;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

public class ConvertToJpg implements Converter {
    public ConvertToJpg() {
    }

    public Image convert(MultipartFile file, byte[] image) throws IOException {
        ByteArrayInputStream bais = new ByteArrayInputStream(image);
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
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(newBufferedImage, "jpg", baos);
        String fileName = file.getOriginalFilename();
        if (fileName != null) {
            int pos = fileName.lastIndexOf(".");
            if (pos != -1) fileName = fileName.substring(0, pos);
        } else {
            fileName = "No name";
        }
        return new Image(baos.toByteArray(), fileName);
    }
}
