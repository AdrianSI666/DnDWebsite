package com.as.dndwebsite.places.kingdom.region;

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

import static com.as.dndwebsite.places.kingdom.region.RegionService.REGION_NOT_FOUND_MSG;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class RegionImageService implements IRegionImageService {
    private final RegionRepository regionRepository;
    private final ImageRepository imageRepository;
    private final IImageService imageService;

    @Override
    public List<ImageDTO> getImagesOfRegion(long id) {
        return imageRepository.findAllByRegions_Id(id);
    }

    @Override
    public ImageDTO saveImageToRegion(MultipartFile file, Long id) {
        Region region = regionRepository.findById(id).orElseThrow(() -> new NotFoundException(String.format(REGION_NOT_FOUND_MSG, id)));
        return imageService.saveImageToEntry(file, region);
    }

    @Override
    public void deleteImageFromRegion(Long raceId, Long imageId) {
        Region region = regionRepository.findById(raceId).orElseThrow(() -> new NotFoundException(String.format(REGION_NOT_FOUND_MSG, raceId)));
        imageService.deleteImageFromEntry(region, imageId);
    }
}
