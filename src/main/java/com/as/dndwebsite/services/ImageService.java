package com.as.dndwebsite.services;

import com.as.dndwebsite.domain.Image;
import com.as.dndwebsite.exception.NotFoundException;
import com.as.dndwebsite.repository.ImageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class ImageService {
    private final ImageRepository imageRepository;
    private final static String IMAGE_NOT_FOUND_MSG =
            "Image with id %s not found";

    public List<Image> getImages() {
        log.info("Getting Images");
        return imageRepository.findAll();
    }

    public Image getImage(Long id) {
        log.info("Getting Image");
        return imageRepository.findById(id).orElseThrow(
                () -> new NotFoundException(String.format(IMAGE_NOT_FOUND_MSG, id)));
    }

    public Image saveImage(Image image) {
        log.info("Saving new Image {}",image.getId());
        return imageRepository.save(image);
    }

    public Image updateImage(Image image){
        return imageRepository.save(image);
    }

    public void deleteImage(Long id){
        imageRepository.deleteById(id);
    }
}
