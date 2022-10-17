package com.as.dndwebsite.services;

import com.as.dndwebsite.domain.Image;
import com.as.dndwebsite.domain.Race;
import com.as.dndwebsite.exception.BadRequestException;
import com.as.dndwebsite.exception.NotFoundException;
import com.as.dndwebsite.repository.RaceRepository;
import com.as.dndwebsite.repository.SubraceRepository;
import com.as.dndwebsite.util.Converter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
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
public class RaceService {
    private final RaceRepository raceRepository;
    private final SubraceRepository subraceRepository;
    private final ImageService imageService;
    private final static String RACE_NOT_FOUND_MSG =
            "race with name %s not found";
    private final Converter converter;

    public List<Race> getRaces() {
        log.info("Getting races");
        return raceRepository.findAll(Sort.by("name"));
    }

    public Race getRace(String name) {
        log.info("Getting race");
        return raceRepository.findByName(name).orElseThrow(
                () -> new NotFoundException(String.format(RACE_NOT_FOUND_MSG, name)));
    }

    public Race saveRace(Race race) {
        log.info("Saving new race {}", race.getName());
        race.setImages(new ArrayList<>());
        return raceRepository.save(race);
    }

    public void updateRace(Race race) {
        log.info("Updating Race {} with id {}", race.getName(), race.getId());
        Race oldRace = raceRepository.findById(race.getId()).orElseThrow(
                () -> new NotFoundException(String.format(RACE_NOT_FOUND_MSG, race.getId())));
        oldRace.setName(race.getName());
        oldRace.setDescription(race.getDescription());
    }

    public void deleteRace(Long id) {
        Race race = raceRepository.findById(id).orElseThrow(
                () -> new NotFoundException(String.format(RACE_NOT_FOUND_MSG, id)));
        log.info("Deleting Race with id {}", id);
        subraceRepository.deleteAllByRaceId(id);
        raceRepository.delete(race);
    }

    public void saveImageToRace(MultipartFile file, Long id) {
        try {
            byte[] image = file.getBytes();
            log.info("Saving file to comment {}", id);
            if (image.length > 0) {
                Race race = raceRepository.findById(id).orElseThrow(() -> new NotFoundException(String.format(RACE_NOT_FOUND_MSG, id)));
                race.getImages().add(converter.convert(file, image));
            }
        } catch (IOException e) {
            throw new BadRequestException("Couldn't read file." + e.getMessage());
        }
    }

    public void deleteImageFromRace(Long raceId, Long imageId) {
        Race race = raceRepository.findById(raceId).orElseThrow(() -> new NotFoundException(String.format(RACE_NOT_FOUND_MSG, raceId)));
        Image image = imageService.getImage(imageId);
        race.getImages().remove(image);
        imageService.deleteImage(imageId);
    }
}
