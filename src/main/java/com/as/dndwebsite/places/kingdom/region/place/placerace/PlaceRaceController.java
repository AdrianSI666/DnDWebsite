package com.as.dndwebsite.places.kingdom.region.place.placerace;

import com.as.dndwebsite.dto.EntryDTO;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/places")
@RequiredArgsConstructor
public class PlaceRaceController {
    private final IPlaceRaceService placeRaceService;
    private final IPageMapper pageMapper;
    @GetMapping("/{name}/race")
    public ResponseEntity<Map<String, Object>> getRacesRelatedToPlace(@PathVariable("name") String name,
                                                                      @RequestParam(defaultValue = ("number:1; size:30")) PageInfo pageInfo) {

        return ResponseEntity.ok().body(pageMapper.convertDataFromPageToMap(placeRaceService.getRacesRelatedToPlace(name, pageInfo)));
    }

    @PostMapping("/{placeId}/race")
    public ResponseEntity<HttpStatus> addNewRace(@PathVariable("placeId") Long placeId,
                                              @RequestBody EntryDTO race) {
        placeRaceService.addNewRaceToPlace(race, placeId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{placeId}/race/{raceId}")
    public ResponseEntity<HttpStatus> addRace(@PathVariable("placeId") Long placeId,
                                              @PathVariable("raceId") Long raceId) {
        placeRaceService.addRaceToPlace(raceId, placeId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{placeId}/race/{raceId}")
    public ResponseEntity<HttpStatus> deleteRace(@PathVariable("placeId") Long placeId,
                                                 @PathVariable("raceId") Long raceId) {
        placeRaceService.removeRaceFromPlace(raceId, placeId);
        return ResponseEntity.ok().build();
    }
}
