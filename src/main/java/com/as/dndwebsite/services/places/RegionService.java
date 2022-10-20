package com.as.dndwebsite.services.places;

import com.as.dndwebsite.domain.Culture;
import com.as.dndwebsite.domain.Image;
import com.as.dndwebsite.domain.places.Kingdom;
import com.as.dndwebsite.domain.places.Place;
import com.as.dndwebsite.domain.places.Region;
import com.as.dndwebsite.exception.BadRequestException;
import com.as.dndwebsite.exception.NotFoundException;
import com.as.dndwebsite.repository.places.KingdomRepository;
import com.as.dndwebsite.repository.places.RegionRepository;
import com.as.dndwebsite.services.CultureService;
import com.as.dndwebsite.services.ImageService;
import com.as.dndwebsite.util.Converter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import static com.as.dndwebsite.services.places.KingdomService.KINGDOM_NOT_FOUND_MSG;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class RegionService {
    private final RegionRepository regionRepository;
    private final KingdomRepository kingdomRepository;
    private final CultureService cultureService;
    private final PlaceService placeService;
    private final ImageService imageService;
    private final Converter converter;
    protected final static String REGION_NOT_FOUND_MSG =
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

    public Region saveRegion(Region region, Long kingdomId) {
        log.info("Saving new Region {}", region.getName());
        Kingdom kingdom = kingdomRepository.findById(kingdomId).orElseThrow(() -> new NotFoundException(String.format(KINGDOM_NOT_FOUND_MSG, kingdomId)));
        region.setImages(new ArrayList<>());
        region.setKingdom(kingdom);
        region.setCultures(new ArrayList<>());
        return regionRepository.save(region);
    }

    public void updateRegion(Region region) {
        Region oldRegion = regionRepository.findById(region.getId()).orElseThrow(
                () -> new NotFoundException(String.format(REGION_NOT_FOUND_MSG, region.getId()))
        );
        log.info("Updating Region: " + oldRegion.getName());
        oldRegion.setName(region.getName());
        oldRegion.setDescription(region.getDescription());
    }

    public void deleteRegion(Long id) {
        log.info("Deleting region with id: " + id);
        Region region = regionRepository.findById(id).orElseThrow(
                () -> new NotFoundException(String.format(REGION_NOT_FOUND_MSG, id))
        );
        List<Place> places = placeService.getPlacesRelatedToRegion(region.getId());
        places.forEach(place -> placeService.deletePlace(place.getId()));
        regionRepository.deleteById(id);
    }

    public void saveImageToRegion(MultipartFile file, Long id) {
        try {
            byte[] image = file.getBytes();
            log.info("Saving file to region {}", id);
            if (image.length > 0) {
                Region region = regionRepository.findById(id).orElseThrow(() -> new NotFoundException(String.format(REGION_NOT_FOUND_MSG, id)));
                region.getImages().add(converter.convert(file, image));
            }
        } catch (IOException e) {
            throw new BadRequestException("Couldn't read file." + e.getMessage());
        }
    }

    public void deleteImageFromRegion(Long regionId, Long imageId) {
        Region region = regionRepository.findById(regionId).orElseThrow(() -> new NotFoundException(String.format(REGION_NOT_FOUND_MSG, regionId)));
        Image image = imageService.getImage(imageId);
        region.getImages().remove(image);
        imageService.deleteImage(imageId);
    }

    public List<Region> getRegionsRelatedToKingdoms(Long id) {
        Kingdom kingdom = kingdomRepository.findById(id).orElseThrow(() -> new NotFoundException(String.format(KINGDOM_NOT_FOUND_MSG, id)));
        return regionRepository.findAllByKingdom(kingdom);
    }

    public void addRegionToKingdom(Long kingdomId, Region region) {
        log.info("Adding region {} to kingdom {}", region.getName(), kingdomId);
        Kingdom kingdom = kingdomRepository.findById(kingdomId).orElseThrow(() -> new NotFoundException(String.format(KINGDOM_NOT_FOUND_MSG, kingdomId)));
        region.setKingdom(kingdom);
        regionRepository.save(region);
    }

    public void setCultureToRegion(String cultureName, Long regionId) {
        Culture culture = cultureService.getCulture(cultureName);
        Region region = regionRepository.findById(regionId).orElseThrow(() -> new NotFoundException(String.format(REGION_NOT_FOUND_MSG, regionId)));
        region.getCultures().add(culture);
    }

    public void removeCultureFromRegion(String cultureName, Long regionId) {
        Culture culture = cultureService.getCulture(cultureName);
        Region region = regionRepository.findById(regionId).orElseThrow(() -> new NotFoundException(String.format(REGION_NOT_FOUND_MSG, regionId)));
        region.getCultures().remove(culture);
    }
}
