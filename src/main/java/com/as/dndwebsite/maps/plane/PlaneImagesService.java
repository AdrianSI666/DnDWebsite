package com.as.dndwebsite.maps.plane;

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

import static com.as.dndwebsite.maps.plane.PlaneService.PLANE_NOT_FOUND_MSG;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class PlaneImagesService implements IPlaneImagesService {
    private final PlaneRepository planeRepository;
    private final ImageRepository imageRepository;
    private final IImageService imageService;

    @Override
    public List<ImageDTO> getImagesOfPlane(long id) {
        return imageRepository.findAllByPlanes_Id(id);
    }

    @Override
    public ImageDTO saveImageToPlane(MultipartFile file, Long id) {
        Plane plane = planeRepository.findById(id).orElseThrow(() -> new NotFoundException(PLANE_NOT_FOUND_MSG.formatted(id)));
        return imageService.saveImageToEntry(file, plane);
    }

    @Override
    public void deleteImageFromPlane(Long planeId, Long imageId) {
        Plane plane = planeRepository.findById(planeId).orElseThrow(() -> new NotFoundException(PLANE_NOT_FOUND_MSG.formatted(planeId)));
        imageService.deleteImageFromEntry(plane, imageId);
    }
}
