package com.as.dndwebsite.places.kingdom.region.place.placeregion;

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
public class PlaceRegionController {
    private final IPlaceRegionService placeRegionService;
    private final IPageMapper pageMapper;

    @GetMapping("/region/{name}")
    public ResponseEntity<Map<String, Object>> getPlacesRelatedToRegion(@PathVariable("name") String name,
                                                                        @RequestParam(defaultValue = ("number:1; size:30")) PageInfo pageInfo) {
        return ResponseEntity.ok().body(pageMapper.convertDataFromPageToMap(placeRegionService.getPlacesRelatedToRegion(name, pageInfo)));
    }

    @PostMapping("/{placeId}/region")
    public ResponseEntity<HttpStatus> addNewRegion(@PathVariable("placeId") Long placeId,
                                                 @RequestBody EntryDTO region) {
        placeRegionService.addNewRegionToPlace(region, placeId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{placeId}/region/{regionId}")
    public ResponseEntity<HttpStatus> setPlaceOfRegion(@PathVariable("placeId") Long placeId,
                                                       @PathVariable("regionId") Long regionId) {
        placeRegionService.setPlaceOfRegion(regionId, placeId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{placeId}/region/{regionId}")
    public ResponseEntity<HttpStatus> removePlaceOfRegion(@PathVariable("placeId") Long placeId,
                                                          @PathVariable("regionId") Long regionId) {
        placeRegionService.removePlaceOfRegion(regionId, placeId);
        return ResponseEntity.ok().build();
    }
}
