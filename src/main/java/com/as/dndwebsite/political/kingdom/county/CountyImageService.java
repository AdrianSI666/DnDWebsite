package com.as.dndwebsite.political.kingdom.county;

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
public class CountyImageService implements ICountyImageService {
    private final CountyRepository countyRepository;
    private final ImageRepository imageRepository;
    private final IImageService imageService;

    @Override
    public List<ImageDTO> getImagesOfCounty(long id) {
        return imageRepository.findAllByCounties_Id(id);
    }

    @Override
    public ImageDTO saveImageToCounty(MultipartFile file, Long id) {
        County county = countyRepository.findById(id).orElseThrow(() -> new NotFoundException(String.format(CountyService.COUNTY_NOT_FOUND_MSG, id)));
        return imageService.saveImageToEntry(file, county);
    }

    @Override
    public void deleteImageFromCounty(Long raceId, Long imageId) {
        County county = countyRepository.findById(raceId).orElseThrow(() -> new NotFoundException(String.format(CountyService.COUNTY_NOT_FOUND_MSG, raceId)));
        imageService.deleteImageFromEntry(county, imageId);
    }
}
