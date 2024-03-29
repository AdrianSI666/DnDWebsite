package com.as.dndwebsite.maps.kingdom.region.regionrace;

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
public class RegionRaceController {
    private final IRegionRaceService regionRaceService;
    private final IPageMapper pageMapper;

    @GetMapping("/{name}/race")
    public ResponseEntity<PageDTO<EntryDTO>> getRacesRelatedToRegion(@PathVariable("name") String name,
                                                                     PageInfo pageInfo) {

        return ResponseEntity.ok().body(pageMapper.mapPageDataToPageDTO(regionRaceService.getRacesRelatedToRegion(name, pageInfo)));
    }

    @GetMapping("/race/{name}")
    public ResponseEntity<PageDTO<EntryDTO>> getRegionsRelatedToRace(@PathVariable("name") String name,
                                                                       PageInfo pageInfo) {

        return ResponseEntity.ok().body(pageMapper.mapPageDataToPageDTO(regionRaceService.getRegionsRelatedToRace(name, pageInfo)));
    }

    @PostMapping("/{regionId}/race")
    public ResponseEntity<HttpStatus> addNewRaceRegionRelation(@PathVariable("regionId") Long regionId,
                                                 @RequestBody EntryDTO race) {
        regionRaceService.addNewRaceToRegion(race, regionId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/race/{raceId}")
    public ResponseEntity<HttpStatus> addNewRegionRaceRelation(@PathVariable("raceId") Long raceId,
                                                 @RequestBody EntryDTO region) {
        regionRaceService.addNewRegionToRace(region, raceId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{regionId}/race/{raceId}")
    public ResponseEntity<HttpStatus> addRaceRegionRelation(@PathVariable("regionId") Long regionId,
                                                            @PathVariable("raceId") Long raceId) {
        regionRaceService.addRaceToRegion(raceId, regionId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{regionId}/race/{raceId}")
    public ResponseEntity<HttpStatus> deleteRaceRegionRelation(@PathVariable("regionId") Long regionId,
                                                               @PathVariable("raceId") Long raceId) {
        regionRaceService.removeRaceFromRegion(raceId, regionId);
        return ResponseEntity.ok().build();
    }
}
