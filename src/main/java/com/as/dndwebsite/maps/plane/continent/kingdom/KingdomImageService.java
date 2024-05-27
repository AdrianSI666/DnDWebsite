package com.as.dndwebsite.maps.plane.continent.kingdom;

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
public class KingdomImageService implements IKingdomImageService {
    private final KingdomRepository kingdomRepository;
    private final ImageRepository imageRepository;
    private final IImageService imageService;

    @Override
    public List<ImageDTO> getImagesOfKingdom(long id) {
        return imageRepository.findAllByKingdoms_Id(id);
    }

    @Override
    public ImageDTO saveImageToKingdom(MultipartFile file, Long id) {
        Kingdom kingdom = kingdomRepository.findById(id).orElseThrow(() -> new NotFoundException(String.format(KingdomService.KINGDOM_NOT_FOUND_MSG, id)));
        return imageService.saveImageToEntry(file, kingdom);
    }

    @Override
    public void deleteImageFromKingdom(Long raceId, Long imageId) {
        Kingdom kingdom = kingdomRepository.findById(raceId).orElseThrow(() -> new NotFoundException(String.format(KingdomService.KINGDOM_NOT_FOUND_MSG, raceId)));
        imageService.deleteImageFromEntry(kingdom, imageId);
    }
}
