package com.as.dndwebsite.geographic.plane.continent.region.regionplace;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageDTO;
import com.as.dndwebsite.dto.PageInfo;
import com.as.dndwebsite.mappers.IPageMapper;
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

    @GetMapping("/unset/place")
    public ResponseEntity<List<EntryDTO>> getAllPlacesWithoutRegion() {
        return ResponseEntity.ok().body(regionPlaceService.getAllPlacesWithoutRegion());
    }

    @PostMapping(path = "/{regionId}/place")
    public ResponseEntity<EntryDTO> addNewPlaceRegionRelation(@PathVariable("regionId") Long regionId,
                                                              @RequestBody EntryDTO place) {
        return ResponseEntity.ok().body(regionPlaceService.addNewPlaceToRegionRelation(place, regionId));
    }

    @PostMapping("/place/{placeId}")
    public ResponseEntity<EntryDTO> addNewRegionPlaceRelation(@PathVariable("placeId") Long placeId,
                                                              @RequestBody EntryDTO region) {
        return ResponseEntity.ok().body(regionPlaceService.addNewRegionToPlaceRelation(region, placeId));
    }

    @PutMapping("/{regionId}/place/{placeId}")
    public ResponseEntity<HttpStatus> addRegionPlaceRelation(@PathVariable("regionId") Long regionId,
                                                             @PathVariable("placeId") Long placeId) {
        regionPlaceService.addPlaceRegionRelation(regionId, placeId);
        return ResponseEntity.ok().build();
    }


    @DeleteMapping(path = "/{regionId}/place/{placeId}")
    public ResponseEntity<HttpStatus> removeRegionPlaceRelation(@PathVariable("regionId") Long regionId,
                                                                @PathVariable("placeId") Long placeId) {
        regionPlaceService.removePlaceRegionRelation(regionId, placeId);
        return ResponseEntity.noContent().build();
    }
}
