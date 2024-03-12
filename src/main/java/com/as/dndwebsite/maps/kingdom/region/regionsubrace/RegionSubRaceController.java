package com.as.dndwebsite.maps.kingdom.region.regionsubrace;

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
public class RegionSubRaceController {
    private final IRegionSubRaceService regionSubRaceService;
    private final IPageMapper pageMapper;

    @GetMapping("/{name}/subrace")
    public ResponseEntity<PageDTO<EntryDTO>> getSubRacesRelatedToRegion(@PathVariable("name") String name,
                                                                        PageInfo pageInfo) {
        return ResponseEntity.ok().body(pageMapper.mapPageDataToPageDTO(regionSubRaceService.getSubRacesRelatedToRegion(name, pageInfo)));
    }

    @GetMapping("/subrace/{name}")
    public ResponseEntity<PageDTO<EntryDTO>> getRegionsRelatedToSubRace(@PathVariable("name") String name,
                                                                          PageInfo pageInfo) {
        return ResponseEntity.ok().body(pageMapper.mapPageDataToPageDTO(regionSubRaceService.getRegionsRelatedToSubRace(name, pageInfo)));
    }

    @PostMapping("/{regionId}/subrace")
    public ResponseEntity<HttpStatus> addNewSubRaceRelation(@PathVariable("regionId") Long regionId,
                                                            @RequestBody EntryDTO subRace) {
        regionSubRaceService.addNewSubRaceToRegion(subRace, regionId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/subrace/{subraceId}")
    public ResponseEntity<HttpStatus> addNewRegionSubRaceRelation(@PathVariable("subraceId") Long subraceId,
                                                                  @RequestBody EntryDTO region) {
        regionSubRaceService.addNewRegionSubRaceRelation(region, subraceId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{regionId}/subrace/{subraceId}")
    public ResponseEntity<HttpStatus> addSubRaceRegionRelation(@PathVariable("regionId") Long regionId,
                                                               @PathVariable("subraceId") Long subRaceId) {
        regionSubRaceService.addSubRaceRegionRelation(subRaceId, regionId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{regionId}/subrace/{subraceId}")
    public ResponseEntity<HttpStatus> deleteSubRaceRegionRelation(@PathVariable("regionId") Long regionId,
                                                                  @PathVariable("subraceId") Long subRaceId) {
        regionSubRaceService.removeSubRaceRegionRelation(subRaceId, regionId);
        return ResponseEntity.ok().build();
    }
}
