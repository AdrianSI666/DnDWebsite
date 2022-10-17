package com.as.dndwebsite.services;

import com.as.dndwebsite.domain.Image;
import com.as.dndwebsite.domain.Race;
import com.as.dndwebsite.domain.Subrace;
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
public class SubraceService {
    private final SubraceRepository subraceRepository;
    private final RaceRepository raceRepository;
    private final ImageService imageService;
    private final static String SUBRACE_NOT_FOUND_MSG =
            "Subrace with name %s not found";
    private final static String RACE_NOT_FOUND_MSG =
            "Subrace with name %s not found";
    private final Converter converter;

    public List<Subrace> getSubraces() {
        log.info("Getting Subraces");
        return subraceRepository.findAll(Sort.by("name"));
    }

    public Subrace getSubrace(String name) {
        log.info("Getting Subrace with name: " + name);
        return subraceRepository.findByName(name).orElseThrow(
                () -> new NotFoundException(String.format(SUBRACE_NOT_FOUND_MSG, name)));
    }

    public Subrace saveSubrace(Subrace subrace, Long raceId) {
        Race race = raceRepository.findById(raceId).orElseThrow(
                () -> new NotFoundException(String.format(RACE_NOT_FOUND_MSG, raceId)));
        log.info("Saving new Subrace {}", subrace.getName());
        subrace.setImages(new ArrayList<>());
        subrace.setRace(race);
        return subraceRepository.save(subrace);
    }

    public void updateSubrace(Subrace subrace) {
        log.info("Updating Subrace {} with id {}", subrace.getName(), subrace.getId());
        Subrace oldSubrace = subraceRepository.findById(subrace.getId()).orElseThrow(
                () -> new NotFoundException(String.format(SUBRACE_NOT_FOUND_MSG, subrace.getId())));
        oldSubrace.setName(subrace.getName());
        oldSubrace.setDescription(subrace.getDescription());
    }

    public void deleteSubrace(Long id) {
        log.info("Deleting Subrace with id {}", id);
        subraceRepository.deleteById(id);
    }

    public void saveImageToSubrace(MultipartFile file, Long id) {
        try {
            byte[] image = file.getBytes();
            log.info("Saving file to comment {}", id);
            if (image.length > 0) {
                Subrace Subrace = subraceRepository.findById(id).orElseThrow(() -> new NotFoundException(String.format(SUBRACE_NOT_FOUND_MSG, id)));
                Subrace.getImages().add(converter.convert(file, image));
            }
        } catch (IOException e) {
            throw new BadRequestException("Couldn't read file." + e.getMessage());
        }
    }

    public void deleteImageFromSubrace(Long subraceId, Long imageId) {
        Subrace subrace = subraceRepository.findById(subraceId).orElseThrow(() -> new NotFoundException(String.format(SUBRACE_NOT_FOUND_MSG, subraceId)));
        Image image = imageService.getImage(imageId);
        subrace.getImages().remove(image);
        imageService.deleteImage(imageId);
    }

    public List<Subrace> getSubracesInRelationToRace(Long raceId) {
        Race race = raceRepository.findById(raceId).orElseThrow(() -> new NotFoundException(String.format(RACE_NOT_FOUND_MSG, raceId)));
        return subraceRepository.findAllByRace(race);
    }

    public void addRaceToSubrace(Long raceId, Subrace subrace) {
        log.info("Adding race {} to subrace {}", raceId, subrace.getName());
        Race race = raceRepository.findById(raceId).orElseThrow(() -> new NotFoundException(String.format(RACE_NOT_FOUND_MSG, raceId)));
        subrace.setRace(race);
        subraceRepository.save(subrace);
    }

    public void setRaceToSubrace(Long subraceId, Long raceId) {
        log.info("Setting race {} to subrace {}", raceId, subraceId);
        Subrace subrace = subraceRepository.findById(subraceId).orElseThrow(() -> new NotFoundException(String.format(SUBRACE_NOT_FOUND_MSG, subraceId)));
        Race race = raceRepository.findById(raceId).orElseThrow(() -> new NotFoundException(String.format(RACE_NOT_FOUND_MSG, raceId)));
        subrace.setRace(race);
    }
}
