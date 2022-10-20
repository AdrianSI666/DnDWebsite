package com.as.dndwebsite.services.places;

import com.as.dndwebsite.domain.Image;
import com.as.dndwebsite.domain.Race;
import com.as.dndwebsite.domain.Subrace;
import com.as.dndwebsite.domain.places.Place;
import com.as.dndwebsite.domain.places.Region;
import com.as.dndwebsite.exception.BadRequestException;
import com.as.dndwebsite.exception.NotFoundException;
import com.as.dndwebsite.repository.RaceRepository;
import com.as.dndwebsite.repository.SubraceRepository;
import com.as.dndwebsite.repository.places.PlaceRepository;
import com.as.dndwebsite.repository.places.RegionRepository;
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

import static com.as.dndwebsite.services.RaceService.RACE_NOT_FOUND_MSG;
import static com.as.dndwebsite.services.SubraceService.SUBRACE_NOT_FOUND_MSG;
import static com.as.dndwebsite.services.places.RegionService.REGION_NOT_FOUND_MSG;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class PlaceService {
    private final PlaceRepository placeRepository;
    private final RegionRepository regionRepository;
    private final RaceRepository raceRepository;
    private final SubraceRepository subraceRepository;
    private final ImageService imageService;
    private final Converter converter;
    protected final static String PLACE_NOT_FOUND_MSG =
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

    public Place savePlace(Place place, Long regionId) {
        log.info("Saving new Place {}", place.getName());
        Region region = regionRepository.findById(regionId).orElseThrow(
                () -> new NotFoundException(String.format(REGION_NOT_FOUND_MSG, regionId)));
        place.setRegion(region);
        place.setImages(new ArrayList<>());
        place.setRaces(new ArrayList<>());
        place.setSubRaces(new ArrayList<>());
        return placeRepository.save(place);
    }

    public void updatePlace(Place place) {
        log.info("Updating place with id: " + place.getId());
        Place oldPlace = placeRepository.findById(place.getId()).orElseThrow(
                () -> new NotFoundException(String.format(PLACE_NOT_FOUND_MSG, place.getId())));
        oldPlace.setName(place.getName());
        oldPlace.setDescription(place.getDescription());
    }

    public void deletePlace(Long id) {
        log.info("Deleting place with id: " + id);
        placeRepository.deleteById(id);
    }

    public void saveImageToPlace(MultipartFile file, Long id) {
        try {
            byte[] image = file.getBytes();
            log.info("Saving file to place {}", id);
            if (image.length > 0) {
                Place place = placeRepository.findById(id).orElseThrow(() -> new NotFoundException(String.format(PLACE_NOT_FOUND_MSG, id)));
                place.getImages().add(converter.convert(file, image));
            }
        } catch (IOException e) {
            throw new BadRequestException("Couldn't read file." + e.getMessage());
        }
    }

    public void deleteImageFromPlace(Long placeId, Long imageId) {
        Place place = placeRepository.findById(placeId)
                .orElseThrow(() -> new NotFoundException(String.format(PLACE_NOT_FOUND_MSG, placeId)));
        Image image = imageService.getImage(imageId);
        place.getImages().remove(image);
        imageService.deleteImage(imageId);
    }

    public List<Place> getPlacesRelatedToRegion(Long regionId) {
        Region region = regionRepository.findById(regionId)
                .orElseThrow(() -> new NotFoundException(String.format(REGION_NOT_FOUND_MSG, regionId)));
        return placeRepository.findAllByRegion(region);
    }

    public void addPlaceToRegion(Long regionId, Place place) {
        log.info("Adding place {} to region {}", place.getName(), regionId);
        Region region = regionRepository.findById(regionId).orElseThrow(() -> new NotFoundException(String.format(REGION_NOT_FOUND_MSG, regionId)));
        place.setRegion(region);
        placeRepository.save(place);
    }

    public void setRaceToPlace(Long raceId, Long placeId) {
        Race race = raceRepository.findById(raceId)
                .orElseThrow(() -> new NotFoundException(String.format(RACE_NOT_FOUND_MSG, raceId)));
        Place place = placeRepository.findById(placeId).orElseThrow(() -> new NotFoundException(String.format(PLACE_NOT_FOUND_MSG, placeId)));
        place.getRaces().add(race);
    }

    public void removeRaceFromPlace(Long raceId, Long placeId) {
        Race race = raceRepository.findById(raceId)
                .orElseThrow(() -> new NotFoundException(String.format(RACE_NOT_FOUND_MSG, raceId)));
        Place place = placeRepository.findById(placeId).orElseThrow(() -> new NotFoundException(String.format(PLACE_NOT_FOUND_MSG, placeId)));
        place.getRaces().remove(race);
    }

    public void setSubraceToPlace(Long subraceId, Long placeId) {
        Subrace subrace = subraceRepository.findById(subraceId)
                .orElseThrow(() -> new NotFoundException(String.format(SUBRACE_NOT_FOUND_MSG, subraceId)));
        Place place = placeRepository.findById(placeId).orElseThrow(() -> new NotFoundException(String.format(PLACE_NOT_FOUND_MSG, placeId)));
        place.getSubRaces().add(subrace);
    }

    public void removeSubraceFromPlace(Long subraceId, Long placeId) {
        Subrace subrace = subraceRepository.findById(subraceId)
                .orElseThrow(() -> new NotFoundException(String.format(SUBRACE_NOT_FOUND_MSG, subraceId)));
        Place place = placeRepository.findById(placeId).orElseThrow(() -> new NotFoundException(String.format(PLACE_NOT_FOUND_MSG, placeId)));
        place.getSubRaces().remove(subrace);
    }
}
