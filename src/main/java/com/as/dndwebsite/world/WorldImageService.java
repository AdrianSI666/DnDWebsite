package com.as.dndwebsite.world;

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

import static com.as.dndwebsite.world.WorldService.WORLD_NOT_FOUND_MSG;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class WorldImageService implements IWorldImageService {
    private final WorldRepository worldRepository;
    private final ImageRepository imageRepository;
    private final IImageService imageService;

    @Override
    public List<ImageDTO> getImagesOfWorld(long id) {
        return imageRepository.findAllByWorlds_Id(id);
    }

    @Override
    public ImageDTO saveImageToWorld(MultipartFile file, Long id) {
        World world = worldRepository.findById(id).orElseThrow(() -> new NotFoundException(WORLD_NOT_FOUND_MSG.formatted(id)));
        return imageService.saveImageToEntry(file, world);
    }

    @Override
    public void deleteImageFromWorld(Long worldId, Long imageId) {
        World world = worldRepository.findById(worldId).orElseThrow(() -> new NotFoundException(WORLD_NOT_FOUND_MSG.formatted(worldId)));
        imageService.deleteImageFromEntry(world, worldId);
    }
}
