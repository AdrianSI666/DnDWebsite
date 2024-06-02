package com.as.dndwebsite.image;

import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.dto.ImageDTO;
import com.as.dndwebsite.exception.BadRequestException;
import com.as.dndwebsite.exception.NotFoundException;
import com.as.dndwebsite.mappers.DomainMapper;
import com.as.dndwebsite.util.ImageConverter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

import static com.as.dndwebsite.image.ImageService.IMAGE_NOT_FOUND_MSG;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class ImageServiceImp implements IImageService {
    private final ImageRepository imageRepository;
    private final ImageConverter converterToJpg;
    private final DomainMapper<Image, ImageDTO> imageMapper;
    public ImageDTO saveImageToEntry(MultipartFile file, Entry entry) {
        try {
            byte[] image = file.getBytes();
            if (image.length == 0) {
                throw new IOException("Empty file.");
            }
            log.info("Saving image to entry of {}", entry.getName());
            Image convertedImage = converterToJpg.convert(file, image);
            entry.getImages().add(convertedImage);
            return imageMapper.map(convertedImage);
        } catch (IOException e) {
            throw new BadRequestException("Couldn't read file." + e.getMessage());
        }
    }

    public void deleteImageFromEntry(Entry entry, Long imageId) {
        Image image = imageRepository.findById(imageId).orElseThrow(() -> new NotFoundException(String.format(IMAGE_NOT_FOUND_MSG, imageId)));
        entry.getImages().remove(image);
        imageRepository.delete(image);
    }
}
