package com.as.dndwebsite.util;

import net.coobird.thumbnailator.Thumbnails;

import java.awt.image.BufferedImage;
import java.io.IOException;

public class ResizeImage {
    private ResizeImage() {
    }

    public static BufferedImage resize(BufferedImage img, int newW, int newH) throws IOException {
        return Thumbnails.of(img).size(newW, newH).asBufferedImage();
    }
}
