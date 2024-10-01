package com.as.dndwebsite.political.kingdom.county.countyregion;

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
@RequestMapping("/counties")
@RequiredArgsConstructor
public class CountyRegionController {
    private final ICountyRegionService countyRegionService;
    private final IPageMapper pageMapper;

    @GetMapping("/{name}/region")
    public ResponseEntity<PageDTO<EntryDTO>> getRegionsWithRelationToCounty(@PathVariable("name") String name,
                                                                             PageInfo pageInfo) {
        return ResponseEntity.ok().body(pageMapper.mapPageDataToPageDTO(countyRegionService.getRegionsRelatedToCounty(name, pageInfo)));
    }

    @GetMapping("/region/{name}")
    public ResponseEntity<List<EntryDTO>> getCountiesRelatedToRegion(@PathVariable("name") String name) {
        return ResponseEntity.ok().body(countyRegionService.getCountiesRelatedToRegion(name));
    }

    @GetMapping("/unset/region")
    public ResponseEntity<List<EntryDTO>> getAllRegionsWithoutCounty() {
        return ResponseEntity.ok().body(countyRegionService.getAllRegionsWithoutCounty());
    }

    @PostMapping("/{countyId}/region")
    public ResponseEntity<EntryDTO> addNewRegionCountyRelation(@PathVariable("countyId") Long countyId,
                                                                  @RequestBody EntryDTO region) {
        return ResponseEntity.ok().body(countyRegionService.addNewRegionCountyRelation(countyId, region));
    }

    @PostMapping("/region/{regionId}")
    public ResponseEntity<EntryDTO> addNewCountyRegionRelation(@PathVariable("regionId") Long regionId,
                                                                  @RequestBody EntryDTO county) {
        return ResponseEntity.ok().body(countyRegionService.addNewCountyRegionRelation(county, regionId));
    }

    @PutMapping("/{countyId}/region/{regionId}")
    public ResponseEntity<HttpStatus> addCountyRegionRelation(@PathVariable("countyId") Long countyId,
                                                               @PathVariable("regionId") Long regionId) {
        countyRegionService.addRegionCountyRelation(countyId, regionId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{countyId}/region/{regionId}")
    public ResponseEntity<HttpStatus> removeCountyRegionRelation(@PathVariable("countyId") Long countyId,
                                                                  @PathVariable("regionId") Long regionId) {
        countyRegionService.removeRegionCountyRelation(countyId, regionId);
        return ResponseEntity.noContent().build();
    }
}
