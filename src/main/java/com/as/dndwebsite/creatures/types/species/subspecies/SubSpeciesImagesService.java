package com.as.dndwebsite.creatures.types.species.subspecies;

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
public class SubSpeciesImagesService implements ISubSpeciesImagesService {
    private final SubSpeciesRepository subSpeciesRepository;
    private final ImageRepository imageRepository;
    private final IImageService imageService;

    @Override
    public List<ImageDTO> getImagesOfSubSpecies(long id) {
        return imageRepository.findAllBySubSpecies_Id(id);
    }

    @Override
    public ImageDTO saveImageToSubSpecies(MultipartFile file, Long id) {
        SubSpecies subSpecies = subSpeciesRepository.findById(id).orElseThrow(() -> new NotFoundException(String.format(SubSpeciesService.SUB_SPECIES_NOT_FOUND_MSG, id)));
        return imageService.saveImageToEntry(file, subSpecies);
    }

    @Override
    public void deleteImageFromSubSpecies(Long speciesId, Long imageId) {
        SubSpecies subSpecies = subSpeciesRepository.findById(speciesId).orElseThrow(() -> new NotFoundException(String.format(SubSpeciesService.SUB_SPECIES_NOT_FOUND_MSG, speciesId)));
        imageService.deleteImageFromEntry(subSpecies, imageId);
    }
}
