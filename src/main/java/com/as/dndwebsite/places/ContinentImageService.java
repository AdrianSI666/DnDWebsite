package com.as.dndwebsite.places;

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

import static com.as.dndwebsite.places.ContinentService.CONTINENT_NOT_FOUND_MSG;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class ContinentImageService implements IContinentImageService {
    private final ContinentRepository continentRepository;
    private final ImageRepository imageRepository;
    private final IImageService imageService;

    @Override
    public List<ImageDTO> getImagesOfContinent(long id) {
        return imageRepository.findAllByContinents_Id(id);
    }

    @Override
    public ImageDTO saveImageToContinent(MultipartFile file, Long id) {
        Continent continent = continentRepository.findById(id).orElseThrow(() -> new NotFoundException(String.format(CONTINENT_NOT_FOUND_MSG, id)));
        return imageService.saveImageToEntry(file, continent);
    }

    @Override
    public void deleteImageFromContinent(Long raceId, Long imageId) {
        Continent continent = continentRepository.findById(raceId).orElseThrow(() -> new NotFoundException(String.format(CONTINENT_NOT_FOUND_MSG, raceId)));
        imageService.deleteImageFromEntry(continent, imageId);
    }
}
