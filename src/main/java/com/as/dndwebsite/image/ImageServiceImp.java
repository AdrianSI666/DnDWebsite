package com.as.dndwebsite.image;

import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.dto.ImageDTO;
import com.as.dndwebsite.exception.BadRequestException;
import com.as.dndwebsite.exception.NotFoundException;
import com.as.dndwebsite.mappers.DomainMapper;
import com.as.dndwebsite.security.OwningSecurityFunctions;
import com.as.dndwebsite.util.ImageConverter;
import com.as.dndwebsite.world.World;
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
    private final OwningSecurityFunctions owningSecurityFunctions;
    public ImageDTO saveImageToEntry(MultipartFile file, Entry entry) {
        owningSecurityFunctions.checkIfLoggedInUserIsTheSameAsAuthor(entry.getWorld().getAuthor(), "Save image", entry.getId());
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

    public ImageDTO saveImageToWorld(MultipartFile file, World world) {
        owningSecurityFunctions.checkIfLoggedInUserIsTheSameAsAuthor(world.getAuthor(), "Save image", world.getId());
        try {
            byte[] image = file.getBytes();
            if (image.length == 0) {
                throw new IOException("Empty file.");
            }
            log.info("Saving image to world of {}", world.getName());
            Image convertedImage = converterToJpg.convert(file, image);
            world.getImages().add(convertedImage);
            return imageMapper.map(convertedImage);
        } catch (IOException e) {
            throw new BadRequestException("Couldn't read file." + e.getMessage());
        }
    }

    public void deleteImageFromEntry(Entry entry, Long imageId) {
        owningSecurityFunctions.checkIfLoggedInUserIsTheSameAsAuthor(entry.getWorld().getAuthor(), "Delete image", entry.getId());
        Image image = imageRepository.findById(imageId).orElseThrow(() -> new NotFoundException(String.format(IMAGE_NOT_FOUND_MSG, imageId)));
        entry.getImages().remove(image);
        imageRepository.delete(image);
    }

    public void deleteImageFromWorld(World world, Long imageId) {
        owningSecurityFunctions.checkIfLoggedInUserIsTheSameAsAuthor(world.getAuthor(), "Delete image", world.getId());
        Image image = imageRepository.findById(imageId).orElseThrow(() -> new NotFoundException(String.format(IMAGE_NOT_FOUND_MSG, imageId)));
        world.getImages().remove(image);
        imageRepository.delete(image);
    }
}
