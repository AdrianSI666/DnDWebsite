package com.as.dndwebsite.race.subrace;

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

import static com.as.dndwebsite.race.subrace.SubRaceService.SUB_RACE_NOT_FOUND_MSG;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class SubRaceImagesService {
    private final SubRaceRepository subRaceRepository;
    private final ImageRepository imageRepository;
    private final IImageService imageService;

    public List<ImageDTO> getImagesOfSubRace(long id) {
        return imageRepository.findAllBySubRaces_Id(id);
    }

    public ImageDTO saveImageToSubRace(MultipartFile file, Long id) {
        SubRace subRace = subRaceRepository.findById(id).orElseThrow(() -> new NotFoundException(String.format(SUB_RACE_NOT_FOUND_MSG, id)));
        return imageService.saveImageToEntry(file, subRace);
    }

    public void deleteImageFromSubRace(Long raceId, Long imageId) {
        SubRace subRace = subRaceRepository.findById(raceId).orElseThrow(() -> new NotFoundException(String.format(SUB_RACE_NOT_FOUND_MSG, raceId)));
        imageService.deleteImageFromEntry(subRace, imageId);
    }
}
