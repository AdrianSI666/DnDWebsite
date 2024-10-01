package com.as.dndwebsite.world.worldcontinent;

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
public class WorldContinentController {
    private final IWorldContinentService worldContinentService;
    private final IPageMapper pageMapper;

    @GetMapping("/{name}/continent")
    public ResponseEntity<PageDTO<EntryDTO>> getContinentsWithRelationToWorld(@PathVariable("name") String name,
                                                                              PageInfo pageInfo) {
        return ResponseEntity.ok().body(pageMapper.mapPageDataToPageDTO(worldContinentService.getContinentsRelatedToWorld(name, pageInfo)));
    }

    @GetMapping("/continent/{name}")
    public ResponseEntity<EntryDTO> getWorldRelatedToContinent(@PathVariable("name") String name) {
        return ResponseEntity.ok().body(worldContinentService.getWorldOfContinent(name));
    }

    @PostMapping("/{worldId}/continent")
    public ResponseEntity<EntryDTO> addNewContinentWorldRelation(@PathVariable("worldId") Long worldId,
                                                                 @RequestBody EntryDTO continent) {
        return ResponseEntity.ok().body(worldContinentService.addNewContinentWorldRelation(worldId, continent));
    }

    @PostMapping("/continent/{continentId}")
    public ResponseEntity<EntryDTO> addNewWorldContinentRelation(@PathVariable("continentId") Long continentId,
                                                                 @RequestBody EntryDTO world) {
        return ResponseEntity.ok().body(worldContinentService.addNewWorldContinentRelation(continentId, world));
    }

    @PostMapping("/{worldId}/continent/{continentId}")
    public ResponseEntity<HttpStatus> addWorldContinentRelation(@PathVariable("worldId") Long worldId,
                                                                @PathVariable("continentId") Long continentId) {
        worldContinentService.setWorldToContinentRelation(worldId, continentId);
        return ResponseEntity.ok().build();
    }
}
