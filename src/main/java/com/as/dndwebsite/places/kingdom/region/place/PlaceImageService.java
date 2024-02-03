package com.as.dndwebsite.places.kingdom.region.place;

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

import static com.as.dndwebsite.places.kingdom.region.place.PlaceService.PLACE_NOT_FOUND_MSG;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class PlaceImageService implements IPlaceImageService {
    private final PlaceRepository placeRepository;
    private final ImageRepository imageRepository;
    private final IImageService imageService;

    @Override
    public List<ImageDTO> getImagesOfPlace(long id) {
        return imageRepository.findAllByPlaces_Id(id);
    }

    @Override
    public ImageDTO saveImageToPlace(MultipartFile file, Long id) {
        Place place = placeRepository.findById(id).orElseThrow(() -> new NotFoundException(String.format(PLACE_NOT_FOUND_MSG, id)));
        return imageService.saveImageToEntry(file, place);
    }

    @Override
    public void deleteImageFromPlace(Long placeId, Long imageId) {
        Place place = placeRepository.findById(placeId).orElseThrow(() -> new NotFoundException(String.format(PLACE_NOT_FOUND_MSG, placeId)));
        imageService.deleteImageFromEntry(place, imageId);
    }
}
