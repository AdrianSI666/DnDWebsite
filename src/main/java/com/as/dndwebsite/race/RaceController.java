package com.as.dndwebsite.race;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.ImageDTO;
import com.as.dndwebsite.dto.PageInfo;
import com.as.dndwebsite.maps.kingdom.region.regionrace.IRegionRaceService;
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
import java.util.Map;

@RestController
@RequestMapping("/races")
@RequiredArgsConstructor
public class RaceController {
    private final IRaceService raceService;
    private final IRaceImagesService raceImagesService;
    private final IRaceSubRaceService raceSubRaceService;
    private final IRegionRaceService regionRaceService;
    private final IPageMapper pageMapper;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getRaces(@RequestParam(defaultValue = ("number:1; size:30")) PageInfo pageInfo) {
        return ResponseEntity.ok().body(pageMapper.convertDataFromPageToMap(raceService.getRaces(pageInfo)));
    }

    @GetMapping("/all") //TODO with security this won't be all but created by account and/or subscribed to
    public ResponseEntity<List<EntryDTO>> getAllRaces() {
        return ResponseEntity.ok().body(raceService.getAllRaces());
    }

    @GetMapping("/{name}")
    public ResponseEntity<RaceDTO> getRaceByName(@PathVariable("name") String name) {
        EntryDTO race = raceService.getRace(name);
        List<EntryDTO> subRaces = raceSubRaceService.getSubRacesOfRace(race.id());
        List<ImageDTO> imageDTOS = raceImagesService.getImagesOfRace(race.id());
        List<EntryDTO> regions = regionRaceService.getRegionsRelatedToRace(race.id());
        return ResponseEntity.ok().body(new RaceDTO(race, subRaces, imageDTOS, regions));
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
    public ResponseEntity<List<ImageDTO>> getImagesOfRace(@PathVariable("id") long id) {
        return ResponseEntity.ok().body(raceImagesService.getImagesOfRace(id));
    }

    @PostMapping(path = "{raceId}/image",
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

}