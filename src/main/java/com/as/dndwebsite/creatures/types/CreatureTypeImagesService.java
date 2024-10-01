package com.as.dndwebsite.creatures.types;

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
public class CreatureTypeImagesService implements ICreatureTypeImagesService {
    private final CreatureTypeRepository creatureTypeRepository;
    private final ImageRepository imageRepository;
    private final IImageService imageService;

    @Override
    public List<ImageDTO> getImagesOfCreatureType(long id) {
        return imageRepository.findAllByCreatureTypes_Id(id);
    }

    @Override
    public ImageDTO saveImageToCreatureType(MultipartFile file, Long id) {
        CreatureType creatureType = creatureTypeRepository.findById(id).orElseThrow(() -> new NotFoundException(String.format(CreatureTypeService.CREATURE_TYPE_NOT_FOUND_MSG, id)));
        return imageService.saveImageToEntry(file, creatureType);
    }

    @Override
    public void deleteImageFromCreatureType(Long creatureTypeId, Long imageId) {
        CreatureType creatureType = creatureTypeRepository.findById(creatureTypeId).orElseThrow(() -> new NotFoundException(String.format(CreatureTypeService.CREATURE_TYPE_NOT_FOUND_MSG, creatureTypeId)));
        imageService.deleteImageFromEntry(creatureType, imageId);
    }
}
