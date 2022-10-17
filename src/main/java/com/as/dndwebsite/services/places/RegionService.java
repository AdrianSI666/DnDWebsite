package com.as.dndwebsite.services.places;

import com.as.dndwebsite.domain.Image;
import com.as.dndwebsite.domain.places.Region;
import com.as.dndwebsite.exception.BadRequestException;
import com.as.dndwebsite.exception.NotFoundException;
import com.as.dndwebsite.repository.places.RegionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class RegionService {
    private final RegionRepository regionRepository;
    private final static String REGION_NOT_FOUND_MSG =
            "Region with name %s not found";

    public List<Region> getRegions() {
        log.info("Getting Regions");
        return regionRepository.findAll();
    }

    public Region getRegion(String name) {
        log.info("Getting Region");
        return regionRepository.findByName(name).orElseThrow(
                () -> new NotFoundException(String.format(REGION_NOT_FOUND_MSG, name)));
    }

    public Region saveRegion(Region region) {
        log.info("Saving new Region {}", region.getName());
        return regionRepository.save(region);
    }

    public Region updateRegion(Region region) {
        return regionRepository.save(region);
    }

    public void deleteRegion(Long id) {
        regionRepository.deleteById(id);
    }

    public void saveImageToRegion(MultipartFile file, Long id) {
        try {
            byte[] image = file.getBytes();
            log.info("Saving file to region {}", id);
            if (image.length > 0) {
                Region region = regionRepository.findById(id).orElseThrow(() -> new NotFoundException(String.format(REGION_NOT_FOUND_MSG, id)));
                log.info("File original name: " + file.getOriginalFilename());
                log.info("File name: " + file.getOriginalFilename());
                region.getImages().add(new Image(image, file.getOriginalFilename()));
            }
        } catch (IOException e) {
            throw new BadRequestException("Couldn't read file." + e.getMessage());
        }
    }
}
