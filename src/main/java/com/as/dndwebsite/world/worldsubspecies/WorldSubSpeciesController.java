package com.as.dndwebsite.world.worldsubspecies;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageDTO;
import com.as.dndwebsite.dto.PageInfo;
import com.as.dndwebsite.mappers.IPageMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/worlds")
@RequiredArgsConstructor
public class WorldSubSpeciesController {
    private final IWorldSubSpeciesService worldSubSpeciesService;
    private final IPageMapper pageMapper;

    @GetMapping("/{name}/subSpecies")
    public ResponseEntity<PageDTO<EntryDTO>> getSubSpeciesWithRelationToWorld(@PathVariable("name") String name,
                                                                              PageInfo pageInfo) {
        return ResponseEntity.ok().body(pageMapper.mapPageDataToPageDTO(worldSubSpeciesService.getSubSpeciesRelatedToWorld(name, pageInfo)));
    }

    @GetMapping("/subSpecies/{name}")
    public ResponseEntity<EntryDTO> getWorldRelatedToSubSpecies(@PathVariable("name") String name) {
        return ResponseEntity.ok().body(worldSubSpeciesService.getWorldOfSubSpecies(name));
    }

    @PostMapping("/{worldId}/subSpecies")
    public ResponseEntity<EntryDTO> addNewSubSpeciesWorldRelation(@PathVariable("worldId") Long worldId,
                                                                  @RequestBody EntryDTO subSpecies) {
        return ResponseEntity.ok().body(worldSubSpeciesService.addNewSubSpeciesWorldRelation(worldId, subSpecies));
    }

    @PostMapping("/subSpecies/{subSpeciesId}")
    public ResponseEntity<EntryDTO> addNewWorldSubSpeciesRelation(@PathVariable("subSpeciesId") Long subSpeciesId,
                                                                  @RequestBody EntryDTO world) {
        return ResponseEntity.ok().body(worldSubSpeciesService.addNewWorldSubSpeciesRelation(subSpeciesId, world));
    }

    @PostMapping("/{worldId}/subSpecies/{subSpeciesId}")
    public ResponseEntity<HttpStatus> addWorldSubSpeciesRelation(@PathVariable("worldId") Long worldId,
                                                                 @PathVariable("subSpeciesId") Long subSpeciesId) {
        worldSubSpeciesService.setWorldToSubSpeciesRelation(worldId, subSpeciesId);
        return ResponseEntity.ok().build();
    }
}
