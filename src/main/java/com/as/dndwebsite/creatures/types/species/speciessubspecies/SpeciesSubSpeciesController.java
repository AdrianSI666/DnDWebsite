package com.as.dndwebsite.creatures.types.species.speciessubspecies;

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
@RequestMapping("/species")
@RequiredArgsConstructor
public class SpeciesSubSpeciesController {
    private final ISpeciesSubSpeciesService speciesSubSpeciesService;
    private final IPageMapper pageMapper;

    @GetMapping("/{name}/subSpecies")
    public ResponseEntity<PageDTO<EntryDTO>> getSubSpeciesOfSpecies(@PathVariable("name") String name,
                                                               PageInfo pageInfo) {
        return ResponseEntity.ok().body(pageMapper.mapPageDataToPageDTO(speciesSubSpeciesService.getSubSpeciesOfSpecies(name, pageInfo)));
    }

    @GetMapping("/subSpecies/{name}")
    public ResponseEntity<EntryDTO> getSpeciesOfSubSpecies(@PathVariable("name") String name) {
        return ResponseEntity.ok().body(speciesSubSpeciesService.getSpeciesOfSubSpecies(name));
    }

    @GetMapping("/unset/subSpecies")
    public ResponseEntity<List<EntryDTO>> getAllSubSpeciesWithoutSpecies() {
        return ResponseEntity.ok().body(speciesSubSpeciesService.getAllSubSpeciesWithoutSpecies());
    }

    @PostMapping("/{speciesId}/subSpecies")
    public ResponseEntity<EntryDTO> addNewSubSpeciesRelation(@PathVariable("speciesId") Long speciesId,
                                                    @RequestBody EntryDTO subSpecies) {
        return ResponseEntity.ok().body(speciesSubSpeciesService.addNewSubSpeciesSpeciesRelation(speciesId, subSpecies));
    }

    @PostMapping("/subSpecies/{subSpeciesId}")
    public ResponseEntity<EntryDTO> addNewSpeciesRelation(@PathVariable("subSpeciesId") Long subSpeciesId,
                                                         @RequestBody EntryDTO species) {
        return ResponseEntity.ok().body(speciesSubSpeciesService.addNewSpeciesSubSpeciesRelation(subSpeciesId, species));
    }

    @PutMapping("/{speciesId}/subSpecies/{subSpeciesId}")
    public ResponseEntity<HttpStatus> addSubSpeciesRelationSpecies(@PathVariable("speciesId") Long speciesId,
                                                 @PathVariable("subSpeciesId") Long subSpeciesId) {
        speciesSubSpeciesService.addSubSpeciesSpeciesRelation(speciesId, subSpeciesId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{speciesId}/subSpecies/{subSpeciesId}")
    public ResponseEntity<HttpStatus> removeSubSpeciesRelationSpecies(@PathVariable("speciesId") Long speciesId,
                                                    @PathVariable("subSpeciesId") Long subSpeciesId) {
        speciesSubSpeciesService.removeSubSpeciesSpeciesRelation(speciesId, subSpeciesId);
        return ResponseEntity.noContent().build();
    }
}
