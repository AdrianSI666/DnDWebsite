package com.as.dndwebsite.culture;

import com.as.dndwebsite.dto.ImageDTO;
import com.as.dndwebsite.exception.NotFoundException;
import com.as.dndwebsite.image.IImageService;
import com.as.dndwebsite.image.ImageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

import static com.as.dndwebsite.culture.CultureService.CULTURE_NOT_FOUND_MSG;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class CultureImagesService {
    private final CultureRepository cultureRepository;
    private final ImageRepository imageRepository;
    private final IImageService imageService;

    public List<ImageDTO> getImagesOfCulture(long id) {
        return imageRepository.findAllByCultures_Id(id);
    }

    public ImageDTO saveImageToCulture(MultipartFile file, Long id) {
        Culture culture = cultureRepository.findById(id).orElseThrow(() -> new NotFoundException(String.format(CULTURE_NOT_FOUND_MSG, id)));
        return imageService.saveImageToEntry(file, culture);
    }

    public void deleteImageFromCulture(Long raceId, Long imageId) {
        Culture culture = cultureRepository.findById(raceId).orElseThrow(() -> new NotFoundException(String.format(CULTURE_NOT_FOUND_MSG, raceId)));
        imageService.deleteImageFromEntry(culture, imageId);
    }
}