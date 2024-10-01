package com.as.dndwebsite.geographic.plane.continent.region.regionspecies;

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
public class RegionSpeciesController {
    private final IRegionSpeciesService regionSpeciesService;
    private final IPageMapper pageMapper;

    @GetMapping("/{name}/species")
    public ResponseEntity<PageDTO<EntryDTO>> getSpeciesRelatedToRegion(@PathVariable("name") String name,
                                                                       PageInfo pageInfo) {

        return ResponseEntity.ok().body(pageMapper.mapPageDataToPageDTO(regionSpeciesService.getSpeciesRelatedToRegion(name, pageInfo)));
    }

    @GetMapping("/species/{name}")
    public ResponseEntity<PageDTO<EntryDTO>> getRegionsRelatedToSpecies(@PathVariable("name") String name,
                                                                        PageInfo pageInfo) {

        return ResponseEntity.ok().body(pageMapper.mapPageDataToPageDTO(regionSpeciesService.getRegionsRelatedToSpecies(name, pageInfo)));
    }

    @PostMapping("/{regionId}/species")
    public ResponseEntity<EntryDTO> addNewSpeciesRegionRelation(@PathVariable("regionId") Long regionId,
                                                                @RequestBody EntryDTO species) {
        return ResponseEntity.ok().body(regionSpeciesService.addNewSpeciesToRegion(species, regionId));
    }

    @PostMapping("/species/{speciesId}")
    public ResponseEntity<EntryDTO> addNewRegionSpeciesRelation(@PathVariable("speciesId") Long speciesId,
                                                                @RequestBody EntryDTO region) {
        return ResponseEntity.ok().body(regionSpeciesService.addNewRegionToSpecies(region, speciesId));
    }

    @PutMapping("/{regionId}/species/{speciesId}")
    public ResponseEntity<HttpStatus> addRegionSpeciesRelation(@PathVariable("regionId") Long regionId,
                                                               @PathVariable("speciesId") Long speciesId) {
        regionSpeciesService.addSpeciesToRegion(speciesId, regionId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{regionId}/species/{speciesId}")
    public ResponseEntity<HttpStatus> deleteRegionSpeciesRelation(@PathVariable("regionId") Long regionId,
                                                                  @PathVariable("speciesId") Long speciesId) {
        regionSpeciesService.removeSpeciesFromRegion(speciesId, regionId);
        return ResponseEntity.noContent().build();
    }
}
