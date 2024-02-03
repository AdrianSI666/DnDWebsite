package com.as.dndwebsite.places.kingdom.region.place.placesubrace;

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
public class PlaceSubRaceController {
    private final IPlaceSubRaceService placeSubRaceService;
    private final IPageMapper pageMapper;

    @GetMapping("/{name}/subrace")
    public ResponseEntity<Map<String, Object>> getSubRacesRelatedToPlace(@PathVariable("name") String name,
                                                                         @RequestParam(defaultValue = ("number:1; size:30")) PageInfo pageInfo) {
        return ResponseEntity.ok().body(pageMapper.convertDataFromPageToMap(placeSubRaceService.getSubRacesRelatedToPlace(name, pageInfo)));
    }

    @PostMapping("/{placeId}/subrace")
    public ResponseEntity<HttpStatus> addNewSubRace(@PathVariable("placeId") Long placeId,
                                                 @RequestBody EntryDTO subRace) {
        placeSubRaceService.addNewSubRaceToPlace(subRace, placeId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{placeId}/subrace/{subraceId}")
    public ResponseEntity<HttpStatus> addSubRace(@PathVariable("placeId") Long placeId,
                                                 @PathVariable("subraceId") Long subRaceId) {
        placeSubRaceService.addSubRaceToPlace(subRaceId, placeId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{placeId}/subrace/{subraceId}")
    public ResponseEntity<HttpStatus> deleteSubRace(@PathVariable("placeId") Long placeId,
                                                    @PathVariable("subraceId") Long subRaceId) {
        placeSubRaceService.removeSubRaceFromPlace(subRaceId, placeId);
        return ResponseEntity.ok().build();
    }
}
