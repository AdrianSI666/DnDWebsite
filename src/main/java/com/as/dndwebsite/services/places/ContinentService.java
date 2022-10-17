package com.as.dndwebsite.services.places;

import com.as.dndwebsite.domain.Image;
import com.as.dndwebsite.domain.places.Continent;
import com.as.dndwebsite.exception.BadRequestException;
import com.as.dndwebsite.exception.NotFoundException;
import com.as.dndwebsite.repository.places.ContinentRepository;
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
public class ContinentService {
    private final ContinentRepository continentRepository;
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
        return continentRepository.save(continent);
    }

    public Continent updateContinent(Continent continent) {
        return continentRepository.save(continent);
    }

    public void deleteContinent(Long id) {
        continentRepository.deleteById(id);
    }

    public void saveImageToContinent(MultipartFile file, Long id) {
        try {
            byte[] image = file.getBytes();
            log.info("Saving file to continent {}", id);
            if (image.length > 0) {
                Continent continent = continentRepository.findById(id).orElseThrow(() -> new NotFoundException(String.format(CONTINENT_NOT_FOUND_MSG, id)));
                log.info("File original name: " + file.getOriginalFilename());
                log.info("File name: " + file.getOriginalFilename());
                continent.getImages().add(new Image(image, file.getOriginalFilename()));
            }
        } catch (IOException e) {
            throw new BadRequestException("Couldn't read file." + e.getMessage());
        }
    }
}
