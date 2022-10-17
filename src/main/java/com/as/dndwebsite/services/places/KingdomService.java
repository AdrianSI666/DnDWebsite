package com.as.dndwebsite.services.places;

import com.as.dndwebsite.domain.Image;
import com.as.dndwebsite.domain.places.Continent;
import com.as.dndwebsite.domain.places.Kingdom;
import com.as.dndwebsite.domain.places.Region;
import com.as.dndwebsite.exception.BadRequestException;
import com.as.dndwebsite.exception.NotFoundException;
import com.as.dndwebsite.repository.places.ContinentRepository;
import com.as.dndwebsite.repository.places.KingdomRepository;
import com.as.dndwebsite.services.ImageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import static com.as.dndwebsite.services.places.ContinentService.CONTINENT_NOT_FOUND_MSG;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class KingdomService {
    private final KingdomRepository kingdomRepository;
    private final ContinentRepository continentRepository;
    private final RegionService regionService;
    private final ImageService imageService;
    protected final static String KINGDOM_NOT_FOUND_MSG =
            "kingdom with name %s not found";

    public List<Kingdom> getKingdoms() {
        log.info("Getting kingdoms");
        return kingdomRepository.findAll();
    }

    public Kingdom getKingdom(String name) {
        log.info("Getting kingdom");
        return kingdomRepository.findByName(name).orElseThrow(
                () -> new NotFoundException(String.format(KINGDOM_NOT_FOUND_MSG, name)));
    }

    public Kingdom saveKingdom(Kingdom kingdom, Long continentId) {
        log.info("Saving new kingdom {}", kingdom.getName());
        Continent continent = continentRepository.findById(continentId).orElseThrow(() -> new NotFoundException(String.format(CONTINENT_NOT_FOUND_MSG, continentId)));
        kingdom.setImages(new ArrayList<>());
        kingdom.setContinent(continent);
        return kingdomRepository.save(kingdom);
    }

    public void updateKingdom(Kingdom kingdom) {
        Kingdom oldKingdom = kingdomRepository.findById(kingdom.getId()).orElseThrow(
                () -> new NotFoundException(String.format(CONTINENT_NOT_FOUND_MSG, kingdom.getName())));
        log.info("Updating continent {} with id {}", oldKingdom.getName(), kingdom.getId());
        oldKingdom.setDescription(kingdom.getDescription());
        oldKingdom.setName(kingdom.getName());
    }

    public void deleteKingdom(Long id) {
        log.info("Deleting kingdom with id: " + id);
        Kingdom kingdom = kingdomRepository.findById(id).orElseThrow(()->new NotFoundException(String.format(KINGDOM_NOT_FOUND_MSG, id)));
        List<Region> regions = regionService.getRegionsRelatedToKingdoms(kingdom.getId());
        regions.forEach(region -> regionService.deleteRegion(region.getId()));
        kingdomRepository.deleteById(id);
    }

    public void saveImageToKingdom(MultipartFile file, Long id) {
        try {
            byte[] image = file.getBytes();
            log.info("Saving file to kingdom {}", id);
            if (image.length > 0) {
                Kingdom kingdom = kingdomRepository.findById(id).orElseThrow(() -> new NotFoundException(String.format(KINGDOM_NOT_FOUND_MSG, id)));
                log.info("File original name: " + file.getOriginalFilename());
                log.info("File name: " + file.getOriginalFilename());
                kingdom.getImages().add(new Image(image, file.getOriginalFilename()));
            }
        } catch (IOException e) {
            throw new BadRequestException("Couldn't read file." + e.getMessage());
        }
    }

    public void deleteImageFromKingdom(Long kingdomId, Long imageId) {
        Kingdom kingdom = kingdomRepository.findById(kingdomId).orElseThrow(() -> new NotFoundException(String.format(KINGDOM_NOT_FOUND_MSG, kingdomId)));
        Image image = imageService.getImage(imageId);
        kingdom.getImages().remove(image);
        imageService.deleteImage(imageId);
    }

    public List<Kingdom> getKingdomsRelatedToContinent(Long id) {
        Continent continent = continentRepository.findById(id).orElseThrow(() -> new NotFoundException(String.format(CONTINENT_NOT_FOUND_MSG, id)));
        return kingdomRepository.findAllByContinent(continent);
    }

    public void addKingdomToContinent(Long continentId, Kingdom kingdom) {
        log.info("Adding kingdom {} to continent {}", continentId, kingdom.getName());
        Continent continent = continentRepository.findById(continentId).orElseThrow(() -> new NotFoundException(String.format(CONTINENT_NOT_FOUND_MSG, continentId)));
        kingdom.setContinent(continent);
        kingdomRepository.save(kingdom);
    }
}
