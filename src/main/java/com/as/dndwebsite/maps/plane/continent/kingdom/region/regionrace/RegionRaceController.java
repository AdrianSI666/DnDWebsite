package com.as.dndwebsite.maps.plane.continent.kingdom.region.regionrace;

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

@RestController
@RequestMapping("/regions")
@RequiredArgsConstructor
public class RegionRaceController {
    private final IRegionRaceService regionRaceService;
    private final IPageMapper pageMapper;

    @GetMapping("/{name}/race")
    public ResponseEntity<PageDTO<EntryDTO>> getRacesRelatedToRegion(@PathVariable("name") String name,
                                                                     PageInfo pageInfo) {

        return ResponseEntity
                .ok()
                .body(
                        pageMapper.mapPageDataToPageDTO(
                                regionRaceService.getRacesRelatedToRegion(name, pageInfo)));
    }

    @GetMapping("/race/{name}")
    public ResponseEntity<PageDTO<EntryDTO>> getRegionsRelatedToRace(@PathVariable("name") String name,
                                                                     PageInfo pageInfo) {

        return ResponseEntity.ok().body(pageMapper.mapPageDataToPageDTO(regionRaceService.getRegionsRelatedToRace(name, pageInfo)));
    }

    @PostMapping("/{regionId}/race")
    public ResponseEntity<EntryDTO> addNewRaceRegionRelation(@PathVariable("regionId") Long regionId,
                                                             @RequestBody EntryDTO race) {
        return ResponseEntity.ok().body(regionRaceService.addNewRaceToRegion(race, regionId));
    }

    @PostMapping("/race/{raceId}")
    public ResponseEntity<EntryDTO> addNewRegionRaceRelation(@PathVariable("raceId") Long raceId,
                                                             @RequestBody EntryDTO region) {
        return ResponseEntity.ok().body(regionRaceService.addNewRegionToRace(region, raceId));
    }

    @PutMapping("/{regionId}/race/{raceId}")
    public ResponseEntity<HttpStatus> addRegionRaceRelation(@PathVariable("regionId") Long regionId,
                                                            @PathVariable("raceId") Long raceId) {
        regionRaceService.addRaceToRegion(raceId, regionId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{regionId}/race/{raceId}")
    public ResponseEntity<HttpStatus> deleteRegionRaceRelation(@PathVariable("regionId") Long regionId,
                                                               @PathVariable("raceId") Long raceId) {
        regionRaceService.removeRaceFromRegion(raceId, regionId);
        return ResponseEntity.ok().build();
    }
}
