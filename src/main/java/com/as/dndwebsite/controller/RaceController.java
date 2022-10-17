package com.as.dndwebsite.controller;

import com.as.dndwebsite.domain.Race;
import com.as.dndwebsite.domain.Subrace;
import com.as.dndwebsite.dto.RaceWithSubrace;
import com.as.dndwebsite.services.RaceService;
import com.as.dndwebsite.services.SubraceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/race")
@RequiredArgsConstructor
@CrossOrigin("http://localhost:8091/")
public class RaceController {
    private final RaceService raceService;
    private final SubraceService subraceService;

    @GetMapping("/all")
    public ResponseEntity<List<RaceWithSubrace>> getRaces() {
        return ResponseEntity.ok().body(getRaceListAsRaceWithSubrace());
    }

    @GetMapping("/find/{name}")
    public ResponseEntity<RaceWithSubrace> getRaceByName(@PathVariable("name") String name) {
        Race race = raceService.getRace(name);
        RaceWithSubrace dataToSend = new RaceWithSubrace(race, subraceService.getSubracesInRelationToRace(race.getId()));
        return ResponseEntity.ok().body(dataToSend);
    }

    @PostMapping("/save")
    public ResponseEntity<RaceWithSubrace> saveRace(@RequestBody Race race) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().toUriString());
        Race saveRace = raceService.saveRace(race);
        ArrayList<Subrace> emptyList = new ArrayList<>();
        RaceWithSubrace dataToSend = new RaceWithSubrace(saveRace, emptyList);
        return ResponseEntity.created(uri).body(dataToSend);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateRace(@PathVariable("id") Long id,
                                                      @RequestBody Race race) {
        race.setId(id);
        raceService.updateRace(race);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<List<?>> deleteRace(@PathVariable("id") Long id) {
        raceService.deleteRace(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping(path = "{raceId}/image",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<RaceWithSubrace>> saveImageToRace(@PathVariable("raceId") long raceId,
                                                                 @RequestParam("image") MultipartFile imageFile) {
        raceService.saveImageToRace(imageFile, raceId);
        return ResponseEntity.ok().body(getRaceListAsRaceWithSubrace());
    }

    @RequestMapping(method = RequestMethod.DELETE, path = "/delete/{raceId}/{imageId}")
    public ResponseEntity<List<RaceWithSubrace>> deleteImageFromRace(@PathVariable("raceId") Long raceId,
                                                                     @PathVariable("imageId") Long imageId) {
        raceService.deleteImageFromRace(raceId, imageId);
        return ResponseEntity.ok().body(getRaceListAsRaceWithSubrace());
    }

    private List<RaceWithSubrace> getRaceListAsRaceWithSubrace() {
        List<Race> races = raceService.getRaces();
        List<RaceWithSubrace> dataToSend = new ArrayList<>();
        races.forEach(race ->
                dataToSend.add(
                        new RaceWithSubrace(race,
                                subraceService.getSubracesInRelationToRace(race.getId())
                        )));
        return dataToSend;
    }

    @RequestMapping(method = RequestMethod.PUT, path = "/subrace/{raceId}")
    public ResponseEntity<?> addSubrace(@PathVariable("raceId") Long raceId,
                                              @RequestBody Subrace subrace) {
        subraceService.addRaceToSubrace(raceId, subrace);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(method = RequestMethod.DELETE, path = "/subrace/{subraceId}")
    public ResponseEntity<List<RaceWithSubrace>> deleteSubrace(@PathVariable("subraceId") Long subraceId) {
        subraceService.deleteSubrace(subraceId);
        return ResponseEntity.ok().body(getRaceListAsRaceWithSubrace());
    }
}