package com.as.dndwebsite.race;

import com.as.dndwebsite.description.IDescriptionEntryService;
import com.as.dndwebsite.dto.DescriptionDTO;
import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.ImageDTO;
import com.as.dndwebsite.dto.PageDTO;
import com.as.dndwebsite.dto.PageInfo;
import com.as.dndwebsite.mappers.IPageMapper;
import com.as.dndwebsite.maps.plane.continent.kingdom.region.regionrace.IRegionRaceService;
import com.as.dndwebsite.race.racesubrace.IRaceSubRaceService;
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

@RestController
@RequestMapping("/races")
@RequiredArgsConstructor
public class RaceController {
    private final IRaceService raceService;
    private final IRaceImagesService raceImagesService;
    private final IRaceSubRaceService raceSubRaceService;
    private final IRegionRaceService regionRaceService;
    private final IPageMapper pageMapper;
    @Qualifier("raceDescriptionService")
    private final IDescriptionEntryService raceDescriptionService;

    @GetMapping
    public ResponseEntity<PageDTO<EntryDTO>> getRaces(PageInfo pageInfo) {
        return ResponseEntity.ok().body(pageMapper.mapPageDataToPageDTO(raceService.getRaces(pageInfo)));
    }

    @GetMapping("/all") //TODO with security this won't be all but created by account and/or subscribed to
    public ResponseEntity<List<EntryDTO>> getAllRaces() {
        return ResponseEntity.ok().body(raceService.getAllRaces());
    }

    @GetMapping("/{name}")
    public ResponseEntity<RaceDTO> getRaceByName(@PathVariable("name") String name) {
        EntryDTO race = raceService.getRace(name);
        List<EntryDTO> subRaces = raceSubRaceService.getSubRacesOfRace(race.id());
        List<DescriptionDTO> descriptionDTOS = raceDescriptionService.getDescriptionsOfEntry(race.id());
        List<ImageDTO> imageDTOS = raceImagesService.getImagesOfRace(race.id());
        List<EntryDTO> regions = regionRaceService.getRegionsRelatedToRace(race.id());
        return ResponseEntity.ok().body(new RaceDTO(race, subRaces, descriptionDTOS, imageDTOS, regions));
    }

    @PostMapping
    public ResponseEntity<EntryDTO> saveRace(@RequestBody EntryDTO race) {
        return ResponseEntity.status(HttpStatus.CREATED).body(raceService.saveRace(race));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HttpStatus> updateRace(@PathVariable("id") Long id,
                                                 @RequestBody EntryDTO race) {
        raceService.updateRace(race, id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteRace(@PathVariable("id") Long id) {
        raceService.deleteRace(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/images")
    public ResponseEntity<List<ImageDTO>> getImagesOfRace(@PathVariable("id") Long id) {
        return ResponseEntity.ok().body(raceImagesService.getImagesOfRace(id));
    }

    @PostMapping(path = "/{raceId}/image",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ImageDTO> saveImageToRace(@PathVariable("raceId") Long raceId,
                                                    @RequestParam("image") MultipartFile imageFile) {
        return ResponseEntity.ok().body(raceImagesService.saveImageToRace(imageFile, raceId));
    }

    @DeleteMapping("/{raceId}/image/{imageId}")
    public ResponseEntity<HttpStatus> deleteImageFromRace(@PathVariable("raceId") Long raceId,
                                                          @PathVariable("imageId") Long imageId) {
        raceImagesService.deleteImageFromRace(raceId, imageId);
        return ResponseEntity.ok().build();
    }

    @PostMapping(path = "/{id}/description")
    public ResponseEntity<DescriptionDTO> saveDescriptionToRace(@PathVariable("id") Long id,
                                                                @RequestBody DescriptionDTO descriptionDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(raceDescriptionService.saveDescriptionToEntry(descriptionDTO, id));
    }

    @GetMapping(path = "/{id}/description")
    public ResponseEntity<List<DescriptionDTO>> getDescriptionsOfRace(@PathVariable("id") Long id) {
        return ResponseEntity.ok().body(raceDescriptionService.getDescriptionsOfEntry(id));
    }

    @DeleteMapping(path = "/{raceId}/description/{descriptionId}")
    public ResponseEntity<HttpStatus> deleteDescriptionFromRace(@PathVariable("raceId") Long raceId,
                                                                @PathVariable("descriptionId") Long imageId) {
        raceDescriptionService.deleteDescriptionFromEntry(raceId, imageId);
        return ResponseEntity.ok().build();
    }

}