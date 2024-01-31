package com.as.dndwebsite.race;

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

import static com.as.dndwebsite.race.RaceService.RACE_NOT_FOUND_MSG;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class RaceImagesService {
    private final RaceRepository raceRepository;
    private final ImageRepository imageRepository;
    private final IImageService imageService;

    public List<ImageDTO> getImagesOfRace(long id) {
        return imageRepository.findAllByRaces_Id(id);
    }

    public ImageDTO saveImageToRace(MultipartFile file, Long id) {
        Race race = raceRepository.findById(id).orElseThrow(() -> new NotFoundException(String.format(RACE_NOT_FOUND_MSG, id)));
        return imageService.saveImageToEntry(file, race);
    }

    public void deleteImageFromRace(Long raceId, Long imageId) {
        Race race = raceRepository.findById(raceId).orElseThrow(() -> new NotFoundException(String.format(RACE_NOT_FOUND_MSG, raceId)));
        imageService.deleteImageFromEntry(race, imageId);
    }
}
