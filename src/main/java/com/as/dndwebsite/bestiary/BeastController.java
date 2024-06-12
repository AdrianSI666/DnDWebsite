package com.as.dndwebsite.bestiary;

import com.as.dndwebsite.description.IDescriptionEntryService;
import com.as.dndwebsite.dto.*;
import com.as.dndwebsite.mappers.IPageMapper;
import com.as.dndwebsite.maps.plane.continent.kingdom.region.regionbeast.IRegionBeastService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/beast")
@RequiredArgsConstructor
public class BeastController {
    private final IBeastService beastService;
    private final IBeastImageService beastImageService;
    private final IRegionBeastService regionBeastService;
    private final IPageMapper pageMapper;
    @Qualifier("beastDescriptionService")
    private final IDescriptionEntryService beastDescriptionService;

    @GetMapping
    public ResponseEntity<PageDTO<EntryDTO>> getBeasts(PageInfo pageInfo) {
        return ResponseEntity.ok().body(pageMapper.mapPageDataToPageDTO(beastService.getBeasts(pageInfo)));
    }

    @GetMapping("/all")
    public ResponseEntity<List<EntryDTO>> getAllBeasts(){
        return ResponseEntity.ok().body(
                beastService.getAllBeasts()
        );
    }

    @GetMapping("/{name}")
    public ResponseEntity<BeastDTO> getBeastByName(@PathVariable("name") String name){
        EntryDTO beast = beastService.getBeast(name);
        List<DescriptionDTO> descriptionDTOS = beastDescriptionService.getDescriptionsOfEntry(beast.id());
        List<ImageDTO> imageDTOS = beastImageService.getImagesOfBeast(beast.id());
        List<EntryDTO> regions = regionBeastService.getRegionsRelatedToBeast(beast.id());
        return ResponseEntity.ok().body(new BeastDTO(beast,descriptionDTOS,imageDTOS,regions));
    }

    @PostMapping
    public ResponseEntity<EntryDTO> saveBeast(@RequestBody EntryDTO beast) {
        return ResponseEntity.status(HttpStatus.CREATED).body(beastService.saveBeast(beast));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HttpStatus> updateBest(@PathVariable("id") Long id,
                                                 @RequestBody EntryDTO beast) {
        beastService.updateBeast(beast, id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteBest(@PathVariable("id") Long id) {
        beastService.deleteBest(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/images")
    public ResponseEntity<List<ImageDTO>> getImagesOfBeast(@PathVariable("id") Long id) {
        return ResponseEntity.ok().body(beastImageService.getImagesOfBeast(id));
    }

    @PostMapping(path = "{beastId}/image",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ImageDTO> saveImageToBeast(@PathVariable("beastId") Long beastId,
                                                    @RequestParam("image") MultipartFile imageFile) {
        return ResponseEntity.ok().body(beastImageService.saveImageToBeast(imageFile, beastId));
    }

    @DeleteMapping("/{beastId}/image/{imageId}")
    public ResponseEntity<HttpStatus> deleteImageFromBeast(@PathVariable("beastId") Long beastId,
                                                          @PathVariable("imageId") Long imageId) {
        beastImageService.deleteImageFromBeast(beastId, imageId);
        return ResponseEntity.ok().build();
    }
    @PostMapping(path = "{id}/description")
    public ResponseEntity<DescriptionDTO> saveDescriptionToBest(@PathVariable("id") Long id,
                                                                @RequestBody DescriptionDTO descriptionDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(beastDescriptionService.saveDescriptionToEntry(descriptionDTO, id));
    }

    @GetMapping(path = "{id}/description")
    public ResponseEntity<List<DescriptionDTO>> getDescriptionsOfBeast(@PathVariable("id") Long id) {
        return ResponseEntity.ok().body(beastDescriptionService.getDescriptionsOfEntry(id));
    }

    @DeleteMapping(path = "/{bestId}/description/{descriptionId}")
    public ResponseEntity<HttpStatus> deleteDescriptionFromBeast(@PathVariable("bestId") Long bestId,
                                                                @PathVariable("descriptionId") Long imageId) {
        beastDescriptionService.deleteDescriptionFromEntry(bestId, imageId);
        return ResponseEntity.ok().build();
    }
}
