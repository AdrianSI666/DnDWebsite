package com.as.dndwebsite.race.racesubrace;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageDTO;
import com.as.dndwebsite.dto.PageInfo;
import com.as.dndwebsite.util.IPageMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/races")
@RequiredArgsConstructor
public class RaceSubRaceController {
    private final IRaceSubRaceService raceSubRaceService;
    private final IPageMapper pageMapper;

    @GetMapping("/{name}/subRace")
    public ResponseEntity<PageDTO<EntryDTO>> getSubRacesOfRace(@PathVariable("name") String name,
                                                               PageInfo pageInfo) {
        return ResponseEntity.ok().body(pageMapper.mapPageDataToPageDTO(raceSubRaceService.getSubRacesOfRace(name, pageInfo)));
    }

    @GetMapping("/subRace/{name}")
    public ResponseEntity<EntryDTO> getRaceOfSubRace(@PathVariable("name") String name) {
        return ResponseEntity.ok().body(raceSubRaceService.getRaceOfSubRace(name));
    }

    @GetMapping("/unset/subRace")
    public ResponseEntity<List<EntryDTO>> getAllSubRacesWithoutRace() {
        return ResponseEntity.ok().body(raceSubRaceService.getAllSubRacesWithoutRace());
    }

    @PostMapping("/{raceId}/subRace")
    public ResponseEntity<EntryDTO> addNewSubRaceRelation(@PathVariable("raceId") Long raceId,
                                                    @RequestBody EntryDTO subRace) {
        return ResponseEntity.ok().body(raceSubRaceService.addNewSubRaceRaceRelation(raceId, subRace));
    }

    @PostMapping("/subRace/{subRaceId}")
    public ResponseEntity<EntryDTO> addNewRaceRelation(@PathVariable("subRaceId") Long subRaceId,
                                                         @RequestBody EntryDTO race) {
        return ResponseEntity.ok().body(raceSubRaceService.addNewRaceSubRaceRelation(subRaceId, race));
    }

    @PutMapping("/{raceId}/subRace/{subRaceId}")
    public ResponseEntity<HttpStatus> addSubRaceRelationRace(@PathVariable("raceId") Long raceId,
                                                 @PathVariable("subRaceId") Long subRaceId) {
        raceSubRaceService.addSubRaceRaceRelation(raceId, subRaceId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{raceId}/subRace/{subRaceId}")
    public ResponseEntity<HttpStatus> removeSubRaceRelationRace(@PathVariable("raceId") Long raceId,
                                                    @PathVariable("subRaceId") Long subRaceId) {
        raceSubRaceService.removeSubRaceRaceRelation(raceId, subRaceId);
        return ResponseEntity.ok().build();
    }
}
