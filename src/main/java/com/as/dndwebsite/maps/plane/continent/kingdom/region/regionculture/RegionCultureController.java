package com.as.dndwebsite.maps.plane.continent.kingdom.region.regionculture;

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
public class RegionCultureController {
    private final IRegionCultureService regionCultureService;
    private final IPageMapper pageMapper;

    @GetMapping("/{name}/culture")
    public ResponseEntity<PageDTO<EntryDTO>> getCulturesRelatedToRegion(@PathVariable("name") String name,
                                                                        PageInfo pageInfo) {
        return ResponseEntity.ok().body(pageMapper.mapPageDataToPageDTO(regionCultureService.getCulturesRelatedToRegion(name, pageInfo)));
    }

    @GetMapping("/culture/{name}")
    public ResponseEntity<PageDTO<EntryDTO>> getRegionsRelatedToCulture(@PathVariable("name") String name,
                                                                        PageInfo pageInfo) {
        return ResponseEntity.ok().body(pageMapper.mapPageDataToPageDTO(regionCultureService.getRegionsRelatedToCulture(name, pageInfo)));
    }

    @PostMapping(path = "/{regionId}/culture")
    public ResponseEntity<EntryDTO> addNewCultureRegionRelation(@PathVariable("regionId") Long regionId,
                                                                @RequestBody EntryDTO culture) {
        return ResponseEntity.ok().body(regionCultureService.addNewCultureToRegionRelation(culture, regionId));
    }

    @PostMapping(path = "/culture/{cultureId}")
    public ResponseEntity<EntryDTO> addNewRegionCultureRegion(@PathVariable("cultureId") Long cultureId,
                                                              @RequestBody EntryDTO region) {
        EntryDTO newRegion = regionCultureService.addNewRegionToCultureRelation(region, cultureId);
        return ResponseEntity.ok().body(newRegion);
    }

    @PutMapping(path = "/{regionId}/culture/{cultureId}")
    public ResponseEntity<HttpStatus> addCultureRegionRelation(@PathVariable("regionId") Long regionId,
                                                               @PathVariable("cultureId") Long culture) {
        regionCultureService.addCultureRegionRelation(culture, regionId);
        return ResponseEntity.ok().build();
    }


    @DeleteMapping("/{regionId}/culture/{cultureId}")
    public ResponseEntity<HttpStatus> deleteCultureRegionRelation(@PathVariable("regionId") Long regionId,
                                                                  @PathVariable("cultureId") Long cultureId) {
        regionCultureService.removeCultureRegionRelation(cultureId, regionId);
        return ResponseEntity.ok().build();
    }
}
