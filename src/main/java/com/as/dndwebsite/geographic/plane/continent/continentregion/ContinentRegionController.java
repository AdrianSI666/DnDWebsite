package com.as.dndwebsite.geographic.plane.continent.continentregion;

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
@RequestMapping("/continents")
@RequiredArgsConstructor
public class ContinentRegionController {
    private final IContinentRegionService continentRegionService;
    private final IPageMapper pageMapper;

    @GetMapping("/{name}/region")
    public ResponseEntity<PageDTO<EntryDTO>> getRegionsWithRelationToContinent(@PathVariable("name") String name,
                                                                             PageInfo pageInfo) {
        return ResponseEntity.ok().body(pageMapper.mapPageDataToPageDTO(continentRegionService.getRegionsRelatedToContinent(name, pageInfo)));
    }

    @GetMapping("/region/{name}")
    public ResponseEntity<EntryDTO> getContinentRelatedToRegion(@PathVariable("name") String name) {
        return ResponseEntity.ok().body(continentRegionService.getContinentRelatedToRegion(name));
    }

    @GetMapping("/unset/region")
    public ResponseEntity<List<EntryDTO>> getAllRegionsWithoutContinent() {
        return ResponseEntity.ok().body(continentRegionService.getAllRegionsWithoutContinent());
    }

    @PostMapping("/{continentId}/region")
    public ResponseEntity<EntryDTO> addNewRegionContinentRelation(@PathVariable("continentId") Long continentId,
                                                                  @RequestBody EntryDTO region) {
        return ResponseEntity.ok().body(continentRegionService.addNewRegionContinentRelation(continentId, region));
    }

    @PostMapping("/region/{regionId}")
    public ResponseEntity<EntryDTO> addNewContinentRegionRelation(@PathVariable("regionId") Long regionId,
                                                                  @RequestBody EntryDTO continent) {
        return ResponseEntity.ok().body(continentRegionService.addNewContinentRegionRelation(continent, regionId));
    }

    @PutMapping("/{continentId}/region/{regionId}")
    public ResponseEntity<HttpStatus> addContinentRegionRelation(@PathVariable("continentId") Long continentId,
                                                               @PathVariable("regionId") Long regionId) {
        continentRegionService.addRegionContinentRelation(continentId, regionId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{continentId}/region/{regionId}")
    public ResponseEntity<HttpStatus> removeContinentRegionRelation(@PathVariable("continentId") Long continentId,
                                                                  @PathVariable("regionId") Long regionId) {
        continentRegionService.removeRegionContinentRelation(continentId, regionId);
        return ResponseEntity.noContent().build();
    }
}
