package com.as.dndwebsite.race.subrace;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.ImageDTO;
import com.as.dndwebsite.dto.PageDTO;
import com.as.dndwebsite.dto.PageInfo;
import com.as.dndwebsite.maps.plane.continent.kingdom.region.regionsubrace.IRegionSubRaceService;
import com.as.dndwebsite.race.racesubrace.IRaceSubRaceService;
import com.as.dndwebsite.util.IPageMapper;
import lombok.RequiredArgsConstructor;
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
@RequestMapping("/subraces")
@RequiredArgsConstructor
public class SubRaceController {
    private final IRaceSubRaceService raceSubRaceService;
    private final ISubRaceService subRaceService;
    private final ISubRaceImagesService subRaceImagesService;
    private final IRegionSubRaceService regionSubRaceService;
    private final IPageMapper pageMapper;

    @GetMapping
    public ResponseEntity<PageDTO<EntryDTO>> getSubRaces(PageInfo pageInfo) {
        return ResponseEntity.ok().body(pageMapper.mapPageDataToPageDTO(subRaceService.getSubRaces(pageInfo)));
    }

    @GetMapping("/all") //TODO with security this won't be all but created by account and/or subscribed to
    public ResponseEntity<List<EntryDTO>> getAllSubRaces() {
        return ResponseEntity.ok().body(subRaceService.getAllSubRaces());
    }

    @GetMapping("/{name}")
    public ResponseEntity<SubRaceDTO> getSubRaceByName(@PathVariable("name") String name) {
        EntryDTO subRace = subRaceService.getSubRaceByName(name);
        Optional<EntryDTO> race = raceSubRaceService.getRaceOfSubRace(subRace.id());
        List<ImageDTO> images = subRaceImagesService.getImagesOfSubRace(subRace.id());
        List<EntryDTO> regions = regionSubRaceService.getRegionsRelatedToSubRace(subRace.id());
        return ResponseEntity.ok().body(new SubRaceDTO(subRace, race, images, regions));
    }

    @PostMapping
    public ResponseEntity<EntryDTO> saveSubRace(@RequestBody EntryDTO subRace) {
        return ResponseEntity.status(HttpStatus.CREATED).body(subRaceService.saveSubRace(subRace));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HttpStatus> updateSubRace(@PathVariable("id") Long id,
                                                    @RequestBody EntryDTO entryDTO) {
        subRaceService.updateSubRace(entryDTO, id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteSubRace(@PathVariable("id") Long id) {
        subRaceService.deleteSubRace(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/images")
    public ResponseEntity<List<ImageDTO>> getImagesOfSubRace(@PathVariable("id") long id) {
        return ResponseEntity.ok().body(subRaceImagesService.getImagesOfSubRace(id));
    }

    @PostMapping(path = "{id}/image",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ImageDTO> saveImageToSubRace(@PathVariable("id") Long id,
                                                       @RequestParam("image") MultipartFile imageFile) {
        return ResponseEntity.ok().body(subRaceImagesService.saveImageToSubRace(imageFile, id));
    }

    @DeleteMapping(path = "/{id}/image/{imageId}")
    public ResponseEntity<HttpStatus> deleteImageFromSubRace(@PathVariable("id") Long id,
                                                             @PathVariable("imageId") Long imageId) {
        subRaceImagesService.deleteImageFromSubRace(id, imageId);
        return ResponseEntity.ok().build();
    }
}