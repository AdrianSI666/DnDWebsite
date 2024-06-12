package com.as.dndwebsite.bestiary;

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

import static com.as.dndwebsite.bestiary.BeastService.BEAST_NOT_FOUND_MSG;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class BeastImageService implements IBeastImageService {
    private final BeastRepository beastRepository;
    private final ImageRepository imageRepository;
    private final IImageService imageService;

    @Override
    public List<ImageDTO> getImagesOfBeast(long id) {
        return imageRepository.findAllByBeasts_Id(id);
    }

    @Override
    public ImageDTO saveImageToBeast(MultipartFile file, Long id) {
        Beast beast = beastRepository.findById(id).orElseThrow(
                () -> new NotFoundException(
                        String.format(BEAST_NOT_FOUND_MSG,id)));
        return imageService.saveImageToEntry(file,beast);
    }

    @Override
    public void deleteImageFromBeast(Long beastId, Long imageId) {
        Beast beast =
                beastRepository.findById(beastId).orElseThrow(
                        ()->new NotFoundException(String.format(BEAST_NOT_FOUND_MSG,beastId)));
        imageService.deleteImageFromEntry(beast,imageId);
    }
}
