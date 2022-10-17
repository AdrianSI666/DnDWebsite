package com.as.dndwebsite.services;

import com.as.dndwebsite.domain.Culture;
import com.as.dndwebsite.domain.Image;
import com.as.dndwebsite.exception.BadRequestException;
import com.as.dndwebsite.exception.NotFoundException;
import com.as.dndwebsite.repository.CultureRepository;
import com.as.dndwebsite.util.Converter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class CultureService {
    private final CultureRepository cultureRepository;
    private final ImageService imageService;
    private final static String CULTURE_NOT_FOUND_MSG =
            "culture with name %s not found";
    private final Converter converter;

    public List<Culture> getCultures() {
        log.info("Getting Cultures");
        return cultureRepository.findAll(Sort.by("name"));
    }

    public Culture getCulture(String name) {
        log.info("Getting Culture");
        return cultureRepository.findByName(name).orElseThrow(
                () -> new NotFoundException(String.format(CULTURE_NOT_FOUND_MSG, name)));
    }

    public Culture saveCulture(Culture culture) {
        log.info("Saving new Culture {}", culture.getName());
        culture.setImages(new ArrayList<>());
        return cultureRepository.save(culture);
    }

    public Culture updateCulture(Culture culture) {
        log.info("Updating Culture {} with id {}", culture.getName(), culture.getId());
        Culture oldCulture = cultureRepository.findById(culture.getId()).orElseThrow(
                () -> new NotFoundException(String.format(CULTURE_NOT_FOUND_MSG, culture.getId())));
        oldCulture.setName(culture.getName());
        oldCulture.setDescription(culture.getDescription());
        return oldCulture;
    }

    public void deleteCulture(Long id) {
        log.info("Deleting Culture with id {}", id);
        cultureRepository.deleteById(id);
    }

    public void saveImageToCulture(MultipartFile file, Long id) {
        try {
            byte[] image = file.getBytes();
            log.info("Saving file to comment {}", id);
            if (image.length > 0) {
                Culture culture = cultureRepository.findById(id).orElseThrow(() -> new NotFoundException(String.format(CULTURE_NOT_FOUND_MSG, id)));
                culture.getImages().add(converter.convert(file, image));
            }
        } catch (IOException e) {
            throw new BadRequestException("Couldn't read file." + e.getMessage());
        }
    }

    public void deleteImageFromCulture(Long cultureId, Long imageId) {
        Culture culture = cultureRepository.findById(cultureId).orElseThrow(() -> new NotFoundException(String.format(CULTURE_NOT_FOUND_MSG, cultureId)));
        Image image = imageService.getImage(imageId);
        culture.getImages().remove(image);
        imageService.deleteImage(imageId);
    }
}
