package com.as.dndwebsite.world.worldspecies;

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
public class WorldSpeciesController {
    private final IWorldSpeciesService worldSpeciesService;
    private final IPageMapper pageMapper;

    @GetMapping("/{name}/species")
    public ResponseEntity<PageDTO<EntryDTO>> getSpeciesWithRelationToWorld(@PathVariable("name") String name,
                                                                           PageInfo pageInfo) {
        return ResponseEntity.ok().body(pageMapper.mapPageDataToPageDTO(worldSpeciesService.getSpeciesRelatedToWorld(name, pageInfo)));
    }

    @GetMapping("/species/{name}")
    public ResponseEntity<EntryDTO> getWorldRelatedToSpecies(@PathVariable("name") String name) {
        return ResponseEntity.ok().body(worldSpeciesService.getWorldOfSpecies(name));
    }

    @PostMapping("/{worldId}/species")
    public ResponseEntity<EntryDTO> addNewSpeciesWorldRelation(@PathVariable("worldId") Long worldId,
                                                              @RequestBody EntryDTO species) {
        return ResponseEntity.ok().body(worldSpeciesService.addNewSpeciesWorldRelation(worldId, species));
    }

    @PostMapping("/species/{speciesId}")
    public ResponseEntity<EntryDTO> addNewWorldSpeciesRelation(@PathVariable("speciesId") Long speciesId,
                                                              @RequestBody EntryDTO world) {
        return ResponseEntity.ok().body(worldSpeciesService.addNewWorldSpeciesRelation(speciesId, world));
    }

    @PostMapping("/{worldId}/species/{speciesId}")
    public ResponseEntity<HttpStatus> addWorldSpeciesRelation(@PathVariable("worldId") Long worldId,
                                                             @PathVariable("speciesId") Long speciesId) {
        worldSpeciesService.setWorldToSpeciesRelation(worldId, speciesId);
        return ResponseEntity.ok().build();
    }
}
