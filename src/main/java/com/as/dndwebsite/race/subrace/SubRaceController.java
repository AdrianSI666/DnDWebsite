package com.as.dndwebsite.race.subrace;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.EntryFullDTO;
import com.as.dndwebsite.dto.ImageDTO;
import com.as.dndwebsite.dto.PageInfo;
import com.as.dndwebsite.race.RaceService;
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

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/subraces")
@RequiredArgsConstructor
public class SubRaceController {
    private final RaceService raceService;
    private final SubRaceService subRaceService;
    private final SubRaceImagesService subRaceImagesService;
    private final IPageMapper pageMapper;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getSubRaces(@RequestParam(defaultValue = ("number:1; size:30")) PageInfo pageInfo) {
        return ResponseEntity.ok().body(pageMapper.convertDataFromPageToMap(subRaceService.getSubRaces(pageInfo)));
    }

    @GetMapping("/{id}/images")
    public ResponseEntity<List<ImageDTO>> getImagesOfSubRace(@PathVariable("id") long id) {
        return ResponseEntity.ok().body(subRaceImagesService.getImagesOfSubRace(id));
    }

    @GetMapping("/{name}")
    public ResponseEntity<EntryFullDTO> getSubRaceByName(@PathVariable("name") String name) {
        EntryDTO subRace = subRaceService.getSubRaceByName(name);
        EntryDTO race = raceService.getRaceOfSubRace(subRace.id());
        List<ImageDTO> images = subRaceImagesService.getImagesOfSubRace(subRace.id());
        return ResponseEntity.ok().body(new EntryFullDTO(subRace, race, new ArrayList<>(), images));
    }

    @GetMapping("/race/{name}")
    public ResponseEntity<List<EntryDTO>> getSubRacesWithRelationToRace(@PathVariable("name") String name) {
        return ResponseEntity.ok().body(subRaceService.getSubRacesInRelationToRace(name));
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

    @PutMapping("/{subRaceId}/race/{raceId}")
    public ResponseEntity<HttpStatus> setRaceToSubRace(@PathVariable("subRaceId") Long subRaceId,
                                              @PathVariable("raceId") Long raceId) {
        subRaceService.setRaceToSubRace(subRaceId, raceId);
        return ResponseEntity.ok().build();
    }
}