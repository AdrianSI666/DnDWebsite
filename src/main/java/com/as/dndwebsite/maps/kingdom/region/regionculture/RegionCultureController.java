package com.as.dndwebsite.maps.kingdom.region.regionculture;

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
public class RegionCultureController {
    private final IRegionCultureService regionCultureService;
    private final IPageMapper pageMapper;

    @GetMapping("/{name}/culture")
    public ResponseEntity<Map<String, Object>> getCulturesRelatedToRegion(@PathVariable("name") String name,
                                                                          @RequestParam(defaultValue = ("number:1; size:30")) PageInfo pageInfo) {
        return ResponseEntity.ok().body(pageMapper.convertDataFromPageToMap(regionCultureService.getCulturesRelatedToRegion(name, pageInfo)));
    }

    @GetMapping("/culture/{name}")
    public ResponseEntity<Map<String, Object>> getRegionsRelatedToCulture(@PathVariable("name") String name,
                                                                          @RequestParam(defaultValue = ("number:1; size:30")) PageInfo pageInfo) {
        return ResponseEntity.ok().body(pageMapper.convertDataFromPageToMap(regionCultureService.getRegionsRelatedToCulture(name, pageInfo)));
    }

    @PostMapping(path = "/{regionId}/culture")
    public ResponseEntity<HttpStatus> addNewCultureRegionRelation(@PathVariable("regionId") Long regionId,
                                                                  @RequestBody EntryDTO culture) {
        regionCultureService.addNewCultureToRegionRelation(culture, regionId);
        return ResponseEntity.ok().build();
    }

    @PostMapping(path = "/culture/{cultureId}")
    public ResponseEntity<HttpStatus> addNewRegionCultureRegion(@PathVariable("cultureId") Long cultureId,
                                                   @RequestBody EntryDTO region) {
        regionCultureService.addNewRegionToCultureRelation(region, cultureId);
        return ResponseEntity.ok().build();
    }

    @PutMapping(path = "/{regionId}/culture/{cultureId}")
    public ResponseEntity<HttpStatus> addCulture(@PathVariable("regionId") Long regionId,
                                                 @PathVariable("cultureId") Long culture) {
        regionCultureService.addCultureRegionRelation(culture, regionId);
        return ResponseEntity.ok().build();
    }


    @DeleteMapping("/{regionId}/culture/{cultureId}")
    public ResponseEntity<HttpStatus> deleteCulture(@PathVariable("regionId") Long regionId,
                                                    @PathVariable("cultureId") Long cultureId) {
        regionCultureService.removeCultureRegionRelation(cultureId, regionId);
        return ResponseEntity.ok().build();
    }
}
