package com.as.dndwebsite.world.worldcreaturetypes;

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
public class WorldCreatureTypeController {
    private final IWorldCreatureTypeService worldCreatureTypeService;
    private final IPageMapper pageMapper;

    @GetMapping("/{name}/creatureType")
    public ResponseEntity<PageDTO<EntryDTO>> getCreatureTypesWithRelationToWorld(@PathVariable("name") String name,
                                                                                 PageInfo pageInfo) {
        return ResponseEntity.ok().body(pageMapper.mapPageDataToPageDTO(worldCreatureTypeService.getCreatureTypesRelatedToWorld(name, pageInfo)));
    }

    @GetMapping("/creatureType/{name}")
    public ResponseEntity<EntryDTO> getWorldRelatedToCreatureType(@PathVariable("name") String name) {
        return ResponseEntity.ok().body(worldCreatureTypeService.getWorldOfCreatureType(name));
    }

    @PostMapping("/{worldId}/creatureType")
    public ResponseEntity<EntryDTO> addNewCreatureTypeWorldRelation(@PathVariable("worldId") Long worldId,
                                                                    @RequestBody EntryDTO creatureType) {
        return ResponseEntity.ok().body(worldCreatureTypeService.addNewCreatureTypeWorldRelation(worldId, creatureType));
    }

    @PostMapping("/creatureType/{creatureTypeId}")
    public ResponseEntity<EntryDTO> addNewWorldCreatureTypeRelation(@PathVariable("creatureTypeId") Long creatureTypeId,
                                                                    @RequestBody EntryDTO world) {
        return ResponseEntity.ok().body(worldCreatureTypeService.addNewWorldCreatureTypeRelation(creatureTypeId, world));
    }

    @PostMapping("/{worldId}/creatureType/{creatureTypeId}")
    public ResponseEntity<HttpStatus> addWorldCreatureTypeRelation(@PathVariable("worldId") Long worldId,
                                                                   @PathVariable("creatureTypeId") Long creatureTypeId) {
        worldCreatureTypeService.setWorldToCreatureTypeRelation(worldId, creatureTypeId);
        return ResponseEntity.ok().build();
    }
}
