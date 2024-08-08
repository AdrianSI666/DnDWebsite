package com.as.dndwebsite.maps.plane.continent.kingdom.region.place;

import com.as.dndwebsite.description.IDescriptionEntryService;
import com.as.dndwebsite.dto.DescriptionDTO;
import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.EntryFullDTO;
import com.as.dndwebsite.dto.ImageDTO;
import com.as.dndwebsite.dto.PageDTO;
import com.as.dndwebsite.dto.PageInfo;
import com.as.dndwebsite.maps.plane.continent.kingdom.region.regionplace.IRegionPlaceService;
import com.as.dndwebsite.mappers.IPageMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/places")
@RequiredArgsConstructor
public class PlaceController {
    private final IPlaceService placeService;
    private final IPlaceImageService placeImageService;
    private final IRegionPlaceService regionPlaceService;
    private final IPageMapper pageMapper;
    @Qualifier("placeDescriptionService")
    private final IDescriptionEntryService placeDescriptionService;

    @GetMapping
    public ResponseEntity<PageDTO<EntryDTO>> getPlaces(PageInfo pageInfo) {
        return ResponseEntity.ok().body(pageMapper.mapPageDataToPageDTO(placeService.getPlaces(pageInfo)));
    }

    @GetMapping("/all") //TODO with security this won't be all but created by account and/or subscribed to
    public ResponseEntity<List<EntryDTO>> getAllPlaces() {
        return ResponseEntity.ok().body(placeService.getAllPlaces());
    }

    @GetMapping("/{name}")
    public ResponseEntity<EntryFullDTO> getPlaceByName(@PathVariable("name") String name) {
        EntryDTO place = placeService.getPlace(name);
        Optional<EntryDTO> region = regionPlaceService.getRegionRelatedToPlace(place.id());
        List<DescriptionDTO> descriptions = placeDescriptionService.getDescriptionsOfEntry(place.id());
        List<ImageDTO> imageDTOS = placeImageService.getImagesOfPlace(place.id());
        return ResponseEntity.ok().body(new EntryFullDTO(place, region, null, descriptions, imageDTOS));
    }

    @PostMapping
    public ResponseEntity<EntryDTO> savePlace(@RequestBody EntryDTO place) {
        return ResponseEntity.status(HttpStatus.CREATED).body(placeService.savePlace(place));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HttpStatus> updatePlace(@RequestBody EntryDTO place,
                                                  @PathVariable("id") Long id) {
        placeService.updatePlace(place, id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deletePlace(@PathVariable("id") Long id) {
        placeService.deletePlace(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping(path = "{placeId}/image",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ImageDTO> saveImageToPlace(@PathVariable("placeId") Long placeId,
                                                     @RequestParam("image") MultipartFile imageFile) {
        return ResponseEntity.ok().body(placeImageService.saveImageToPlace(imageFile, placeId));
    }

    @DeleteMapping("/{placeId}/image/{imageId}")
    public ResponseEntity<HttpStatus> deleteImageFromPlace(@PathVariable("placeId") Long placeId,
                                                            @PathVariable("imageId") Long imageId) {
        placeImageService.deleteImageFromPlace(placeId, imageId);
        return ResponseEntity.ok().build();
    }
    @PostMapping(path = "{id}/description")
    public ResponseEntity<DescriptionDTO> saveDescriptionToPlace(@PathVariable("id") Long id,
                                                                @RequestBody DescriptionDTO descriptionDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(placeDescriptionService.saveDescriptionToEntry(descriptionDTO, id));
    }

    @GetMapping(path = "{id}/description")
    public ResponseEntity<List<DescriptionDTO>> getDescriptionsOfPlace(@PathVariable("id") Long id) {
        return ResponseEntity.ok().body(placeDescriptionService.getDescriptionsOfEntry(id));
    }

    @DeleteMapping(path = "/{placeId}/description/{descriptionId}")
    public ResponseEntity<HttpStatus> deleteDescriptionFromPlace(@PathVariable("placeId") Long placeId,
                                                                @PathVariable("descriptionId") Long imageId) {
        placeDescriptionService.deleteDescriptionFromEntry(placeId, imageId);
        return ResponseEntity.ok().build();
    }
}