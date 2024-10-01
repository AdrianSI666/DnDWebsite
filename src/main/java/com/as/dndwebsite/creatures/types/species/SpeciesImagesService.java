package com.as.dndwebsite.creatures.types.species;

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

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class SpeciesImagesService implements ISpeciesImagesService {
    private final SpeciesRepository speciesRepository;
    private final ImageRepository imageRepository;
    private final IImageService imageService;

    @Override
    public List<ImageDTO> getImagesOfSpecies(long id) {
        return imageRepository.findAllBySpecies_Id(id);
    }

    @Override
    public ImageDTO saveImageToSpecies(MultipartFile file, Long id) {
        Species species = speciesRepository.findById(id).orElseThrow(() -> new NotFoundException(String.format(SpeciesService.SPECIES_NOT_FOUND_MSG, id)));
        return imageService.saveImageToEntry(file, species);
    }

    @Override
    public void deleteImageFromSpecies(Long speciesId, Long imageId) {
        Species species = speciesRepository.findById(speciesId).orElseThrow(() -> new NotFoundException(String.format(SpeciesService.SPECIES_NOT_FOUND_MSG, speciesId)));
        imageService.deleteImageFromEntry(species, imageId);
    }
}
