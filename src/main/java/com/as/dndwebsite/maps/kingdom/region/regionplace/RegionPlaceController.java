package com.as.dndwebsite.maps.kingdom.region.regionplace;

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

@RestController
@RequestMapping("/regions")
@RequiredArgsConstructor
public class RegionPlaceController {
    private final IRegionPlaceService regionPlaceService;
    private final IPageMapper pageMapper;

    @GetMapping("/{name}/place")
    public ResponseEntity<PageDTO<EntryDTO>> getPlacesRelatedToRegion(@PathVariable("name") String name,
                                                                      PageInfo pageInfo) {
        return ResponseEntity.ok().body(pageMapper.mapPageDataToPageDTO(regionPlaceService.getPlacesRelatedToRegion(name, pageInfo)));
    }

    @GetMapping("/place/{name}")
    public ResponseEntity<EntryDTO> getRegionRelatedToPlace(@PathVariable("name") String name) {
        return ResponseEntity.ok().body(regionPlaceService.getRegionRelatedToPlace(name));
    }

    @PostMapping(path = "/{regionId}/place")
    public ResponseEntity<HttpStatus> addNewPlace(@PathVariable("regionId") Long regionId,
                                                  @RequestBody EntryDTO place) {
        regionPlaceService.addNewPlaceToRegionRelation(place, regionId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/place/{placeId}")
    public ResponseEntity<HttpStatus> addNewRegion(@PathVariable("placeId") Long placeId,
                                                   @RequestBody EntryDTO region) {
        regionPlaceService.addNewRegionToPlaceRelation(region, placeId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{regionId}/place/{placeId}")
    public ResponseEntity<HttpStatus> addPlaceRegionRelation(@PathVariable("regionId") Long regionId,
                                               @PathVariable("placeId") Long placeId) {
        regionPlaceService.addPlaceRegionRelation(regionId, placeId);
        return ResponseEntity.ok().build();
    }



    @DeleteMapping(path = "/{regionId}/place/{placeId}")
    public ResponseEntity<HttpStatus> deletePlace(@PathVariable("regionId") Long regionId,
                                                  @PathVariable("placeId") Long placeId) {
        regionPlaceService.removePlaceRegionRelation(regionId, placeId);
        return ResponseEntity.ok().build();
    }
}
