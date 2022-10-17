package com.as.dndwebsite.services.places;

import com.as.dndwebsite.domain.Image;
import com.as.dndwebsite.domain.places.Place;
import com.as.dndwebsite.exception.BadRequestException;
import com.as.dndwebsite.exception.NotFoundException;
import com.as.dndwebsite.repository.places.PlaceRepository;
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
public class PlaceService {
    private final PlaceRepository placeRepository;
    private final static String PLACE_NOT_FOUND_MSG =
            "Place with name %s not found";

    public List<Place> getPlaces() {
        log.info("Getting Places");
        return placeRepository.findAll();
    }

    public Place getPlace(String name) {
        log.info("Getting Place");
        return placeRepository.findByName(name).orElseThrow(
                () -> new NotFoundException(String.format(PLACE_NOT_FOUND_MSG, name)));
    }

    public Place savePlace(Place place) {
        log.info("Saving new Place {}", place.getName());
        return placeRepository.save(place);
    }

    public Place updatePlace(Place place) {
        return placeRepository.save(place);
    }

    public void deletePlace(Long id) {
        placeRepository.deleteById(id);
    }

    public void saveImageToPlace(MultipartFile file, Long id) {
        try {
            byte[] image = file.getBytes();
            log.info("Saving file to place {}", id);
            if (image.length > 0) {
                Place place = placeRepository.findById(id).orElseThrow(() -> new NotFoundException(String.format(PLACE_NOT_FOUND_MSG, id)));
                log.info("File original name: " + file.getOriginalFilename());
                log.info("File name: " + file.getOriginalFilename());
                place.getImages().add(new Image(image, file.getOriginalFilename()));
            }
        } catch (IOException e) {
            throw new BadRequestException("Couldn't read file." + e.getMessage());
        }
    }
}
