package com.as.dndwebsite.mappers;

import com.as.dndwebsite.dto.ImageDTO;
import com.as.dndwebsite.image.Image;
import org.springframework.stereotype.Component;

@Component
public class ImageMapper implements DomainMapper<Image, ImageDTO> {
    @Override
    public ImageDTO map(Image source) {
        return new ImageDTO(source.getId(), source.getName(), source.getContent());
    }
}
