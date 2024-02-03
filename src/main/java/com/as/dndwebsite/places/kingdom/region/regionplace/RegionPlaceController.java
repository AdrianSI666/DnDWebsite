package com.as.dndwebsite.places.kingdom.region.regionplace;

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
@RequestMapping("/regions")
@RequiredArgsConstructor
public class RegionPlaceController {
    private final IRegionPlaceService regionPlaceService;
    private final IPageMapper pageMapper;

    @GetMapping("/{name}/place")
    public ResponseEntity<Map<String, Object>> getPlacesRelatedToRegion(@PathVariable("name") String name,
                                                                        @RequestParam(defaultValue = ("number:1; size:30")) PageInfo pageInfo) {
        return ResponseEntity.ok().body(pageMapper.convertDataFromPageToMap(regionPlaceService.getPlacesRelatedToRegion(name, pageInfo)));
    }

    @PutMapping("/{regionId}/place/{placeId}")
    public ResponseEntity<HttpStatus> addPlace(@PathVariable("regionId") Long regionId,
                                               @PathVariable("placeId") Long placeId) {
        regionPlaceService.addPlace(regionId, placeId);
        return ResponseEntity.ok().build();
    }

    @PostMapping(path = "/{regionId}/place")
    public ResponseEntity<HttpStatus> addNewPlace(@PathVariable("regionId") Long regionId,
                                                  @RequestBody EntryDTO place) {
        regionPlaceService.addNewPlaceToRegion(place, regionId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping(path = "/{regionId}/place/{placeId}")
    public ResponseEntity<HttpStatus> deletePlace(@PathVariable("regionId") Long regionId,
                                                  @PathVariable("placeId") Long placeId) {
        regionPlaceService.removePlace(regionId, placeId);
        return ResponseEntity.ok().build();
    }
}
