package com.as.dndwebsite.geographic.plane.continent.region.regionsubspecies;

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
public class RegionSubSpeciesController {
    private final IRegionSubSpeciesService regionSubSpeciesService;
    private final IPageMapper pageMapper;

    @GetMapping("/{name}/subspecies")
    public ResponseEntity<PageDTO<EntryDTO>> getSubSpeciesRelatedToRegion(@PathVariable("name") String name,
                                                                          PageInfo pageInfo) {
        return ResponseEntity.ok().body(pageMapper.mapPageDataToPageDTO(regionSubSpeciesService.getSubSpeciesRelatedToRegion(name, pageInfo)));
    }

    @GetMapping("/subspecies/{name}")
    public ResponseEntity<PageDTO<EntryDTO>> getRegionsRelatedToSubSpecies(@PathVariable("name") String name,
                                                                           PageInfo pageInfo) {
        return ResponseEntity.ok().body(pageMapper.mapPageDataToPageDTO(regionSubSpeciesService.getRegionsRelatedToSubSpecies(name, pageInfo)));
    }

    @PostMapping("/{regionId}/subspecies")
    public ResponseEntity<EntryDTO> addNewSubSpeciesRegionRelation(@PathVariable("regionId") Long regionId,
                                                                   @RequestBody EntryDTO subSpecies) {
        return ResponseEntity.ok().body(regionSubSpeciesService.addNewSubSpeciesToRegion(subSpecies, regionId));
    }

    @PostMapping("/subspecies/{subspeciesId}")
    public ResponseEntity<EntryDTO> addNewRegionSubSpeciesRelation(@PathVariable("subspeciesId") Long subspeciesId,
                                                                   @RequestBody EntryDTO region) {
        return ResponseEntity.ok().body(regionSubSpeciesService.addNewRegionSubSpeciesRelation(region, subspeciesId));
    }

    @PutMapping("/{regionId}/subspecies/{subspeciesId}")
    public ResponseEntity<HttpStatus> addRegionSubSpeciesRelation(@PathVariable("regionId") Long regionId,
                                                                  @PathVariable("subspeciesId") Long subSpeciesId) {
        regionSubSpeciesService.addSubSpeciesRegionRelation(subSpeciesId, regionId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{regionId}/subspecies/{subspeciesId}")
    public ResponseEntity<HttpStatus> deleteRegionSubSpeciesRelation(@PathVariable("regionId") Long regionId,
                                                                     @PathVariable("subspeciesId") Long subSpeciesId) {
        regionSubSpeciesService.removeSubSpeciesRegionRelation(subSpeciesId, regionId);
        return ResponseEntity.noContent().build();
    }
}
