package com.as.dndwebsite.maps.plane;

import com.as.dndwebsite.description.IDescriptionEntryService;
import com.as.dndwebsite.dto.DescriptionDTO;
import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.EntryFullDTO;
import com.as.dndwebsite.dto.ImageDTO;
import com.as.dndwebsite.dto.PageDTO;
import com.as.dndwebsite.dto.PageInfo;
import com.as.dndwebsite.maps.plane.planecontinent.IPlaneContinentService;
import com.as.dndwebsite.maps.worldplane.IWorldPlaneService;
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
@RequestMapping("/planes")
@RequiredArgsConstructor
public class PlaneController {
    private final IPlaneService planeService;
    private final IPlaneImagesService planeImagesService;
    private final IPageMapper pageMapper;
    private final IPlaneContinentService planeContinentService;
    private final IWorldPlaneService worldPlaneService;
    @Qualifier("planeDescriptionService")
    private final IDescriptionEntryService planeDescriptionService;

    @GetMapping
    public ResponseEntity<PageDTO<EntryDTO>> getPlanes(PageInfo pageInfo) {
        return ResponseEntity.ok().body(pageMapper.mapPageDataToPageDTO(planeService.getPlanes(pageInfo)));
    }

    @GetMapping("/all") //TODO with security this won't be all but created by account and/or subscribed to
    public ResponseEntity<List<EntryDTO>> getAllPlanes() {
        return ResponseEntity.ok().body(planeService.getAllPlanes());
    }

    @GetMapping("/{name}")
    public ResponseEntity<EntryFullDTO> getPlaneByName(@PathVariable("name") String name) {
        EntryDTO plane = planeService.getPlane(name);
        Optional<EntryDTO> world = worldPlaneService.getWorldOfPlane(plane.id());
        List<EntryDTO> continents = planeContinentService.getContinentsRelatedToPlane(plane.id());
        List<DescriptionDTO> descriptions = planeDescriptionService.getDescriptionsOfEntry(plane.id());
        List<ImageDTO> imageDTOS = planeImagesService.getImagesOfPlane(plane.id());
        return ResponseEntity.ok().body(new EntryFullDTO(plane, world, continents, descriptions, imageDTOS));
    }

    @PostMapping
    public ResponseEntity<EntryDTO> savePlane(@RequestBody EntryDTO plane) {
        return ResponseEntity.status(HttpStatus.CREATED).body(planeService.savePlane(plane));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HttpStatus> updatePlane(@PathVariable("id") Long id,
                                                  @RequestBody EntryDTO plane) {
        planeService.updatePlane(plane, id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deletePlane(@PathVariable("id") Long id) {
        planeService.deletePlane(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/images")
    public ResponseEntity<List<ImageDTO>> getImagesOfPlane(@PathVariable("id") Long id) {
        return ResponseEntity.ok().body(planeImagesService.getImagesOfPlane(id));
    }

    @PostMapping(path = "{planeId}/image",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ImageDTO> saveImageToPlane(@PathVariable("planeId") Long planeId,
                                                     @RequestParam("image") MultipartFile imageFile) {
        return ResponseEntity.ok().body(planeImagesService.saveImageToPlane(imageFile, planeId));
    }

    @DeleteMapping("/{planeId}/image/{imageId}")
    public ResponseEntity<HttpStatus> deleteImageFromPlane(@PathVariable("planeId") Long planeId,
                                                           @PathVariable("imageId") Long imageId) {
        planeImagesService.deleteImageFromPlane(planeId, imageId);
        return ResponseEntity.ok().build();
    }

    @PostMapping(path = "{id}/description")
    public ResponseEntity<DescriptionDTO> saveDescriptionToRace(@PathVariable("id") Long id,
                                                                @RequestBody DescriptionDTO descriptionDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(planeDescriptionService.saveDescriptionToEntry(descriptionDTO, id));
    }

    @GetMapping(path = "{id}/description")
    public ResponseEntity<List<DescriptionDTO>> getDescriptionsOfRace(@PathVariable("id") Long id) {
        return ResponseEntity.ok().body(planeDescriptionService.getDescriptionsOfEntry(id));
    }

    @DeleteMapping(path = "/{planeId}/description/{descriptionId}")
    public ResponseEntity<HttpStatus> deleteDescriptionFromRace(@PathVariable("planeId") Long planeId,
                                                                @PathVariable("descriptionId") Long imageId) {
        planeDescriptionService.deleteDescriptionFromEntry(planeId, imageId);
        return ResponseEntity.ok().build();
    }
}
