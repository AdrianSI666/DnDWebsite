package com.as.dndwebsite.creatures.types.typespecies;

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
@RequestMapping("/creatureTypes")
@RequiredArgsConstructor
public class CreatureTypeSpeciesController {
    private final ICreatureTypeSpeciesService creatureTypeSpeciesService;
    private final IPageMapper pageMapper;

    @GetMapping("/{name}/species")
    public ResponseEntity<PageDTO<EntryDTO>> getSpeciessOfCreatureType(@PathVariable("name") String name,
                                                               PageInfo pageInfo) {
        return ResponseEntity.ok().body(pageMapper.mapPageDataToPageDTO(creatureTypeSpeciesService.getSpeciesOfCreatureType(name, pageInfo)));
    }

    @GetMapping("/species/{name}")
    public ResponseEntity<EntryDTO> getCreatureTypeOfSpecies(@PathVariable("name") String name) {
        return ResponseEntity.ok().body(creatureTypeSpeciesService.getCreatureTypeOfSpecies(name));
    }

    @GetMapping("/unset/species")
    public ResponseEntity<List<EntryDTO>> getAllSpeciessWithoutCreatureType() {
        return ResponseEntity.ok().body(creatureTypeSpeciesService.getAllSpeciesWithoutCreatureType());
    }

    @PostMapping("/{creatureTypeId}/species")
    public ResponseEntity<EntryDTO> addNewSpeciesRelation(@PathVariable("creatureTypeId") Long creatureTypeId,
                                                    @RequestBody EntryDTO species) {
        return ResponseEntity.ok().body(creatureTypeSpeciesService.addNewSpeciesCreatureTypeRelation(creatureTypeId, species));
    }

    @PostMapping("/species/{speciesId}")
    public ResponseEntity<EntryDTO> addNewCreatureTypeRelation(@PathVariable("speciesId") Long speciesId,
                                                         @RequestBody EntryDTO creatureType) {
        return ResponseEntity.ok().body(creatureTypeSpeciesService.addNewCreatureTypeSpeciesRelation(speciesId, creatureType));
    }

    @PutMapping("/{creatureTypeId}/species/{speciesId}")
    public ResponseEntity<HttpStatus> addSpeciesRelationCreatureType(@PathVariable("creatureTypeId") Long creatureTypeId,
                                                 @PathVariable("speciesId") Long speciesId) {
        creatureTypeSpeciesService.addSpeciesCreatureTypeRelation(creatureTypeId, speciesId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{creatureTypeId}/species/{speciesId}")
    public ResponseEntity<HttpStatus> removeSpeciesRelationCreatureType(@PathVariable("creatureTypeId") Long creatureTypeId,
                                                    @PathVariable("speciesId") Long speciesId) {
        creatureTypeSpeciesService.removeSpeciesCreatureTypeRelation(creatureTypeId, speciesId);
        return ResponseEntity.noContent().build();
    }
}
