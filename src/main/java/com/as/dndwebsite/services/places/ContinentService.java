package com.as.dndwebsite.services.places;

import com.as.dndwebsite.domain.Image;
import com.as.dndwebsite.domain.places.Continent;
import com.as.dndwebsite.domain.places.Kingdom;
import com.as.dndwebsite.exception.BadRequestException;
import com.as.dndwebsite.exception.NotFoundException;
import com.as.dndwebsite.repository.places.ContinentRepository;
import com.as.dndwebsite.services.ImageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class ContinentService {
    private final ContinentRepository continentRepository;
    private final KingdomService kingdomService;
    private final ImageService imageService;
    protected final static String CONTINENT_NOT_FOUND_MSG =
            "Continent with name %s not found";

    public List<Continent> getContinents() {
        log.info("Getting Continents");
        return continentRepository.findAll();
    }

    public Continent getContinent(String name) {
        log.info("Getting Continent");
        return continentRepository.findByName(name).orElseThrow(
                () -> new NotFoundException(String.format(CONTINENT_NOT_FOUND_MSG, name)));
    }

    public Continent saveContinent(Continent continent) {
        log.info("Saving new Continent {}", continent.getName());
        continent.setImages(new ArrayList<>());
        return continentRepository.save(continent);
    }

    public void updateContinent(Continent continent) {
        Continent oldContinent = continentRepository.findById(continent.getId()).orElseThrow(
                () -> new NotFoundException(String.format(CONTINENT_NOT_FOUND_MSG, continent.getName())));
        log.info("Updating continent {} with id {}", continent.getName(), continent.getId());
        oldContinent.setDescription(continent.getDescription());
        oldContinent.setName(continent.getName());
    }

    public void deleteContinent(Long id) {
        log.info("Deleting continent with id: " + id);
        List<Kingdom> kingdoms = kingdomService.getKingdomsRelatedToContinent(id);
        kingdoms.forEach(kingdom -> kingdomService.deleteKingdom(kingdom.getId()));
        continentRepository.deleteById(id);
    }

    public void saveImageToContinent(MultipartFile file, Long id) {
        try {
            byte[] image = file.getBytes();
            log.info("Saving file to continent {}", id);
            if (image.length > 0) {
                Continent continent = continentRepository.findById(id).orElseThrow(() -> new NotFoundException(String.format(CONTINENT_NOT_FOUND_MSG, id)));
                continent.getImages().add(new Image(image, file.getOriginalFilename()));
            }
        } catch (IOException e) {
            throw new BadRequestException("Couldn't read file." + e.getMessage());
        }
    }

    public void deleteImageFromRace(Long raceId, Long imageId) {
        Continent continent = continentRepository.findById(raceId).orElseThrow(() -> new NotFoundException(String.format(CONTINENT_NOT_FOUND_MSG, raceId)));
        Image image = imageService.getImage(imageId);
        continent.getImages().remove(image);
        imageService.deleteImage(imageId);
    }
}
