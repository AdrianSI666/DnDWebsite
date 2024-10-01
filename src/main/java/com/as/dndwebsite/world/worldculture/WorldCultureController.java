package com.as.dndwebsite.world.worldculture;

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
public class WorldCultureController {
    private final IWorldCultureService worldCultureService;
    private final IPageMapper pageMapper;

    @GetMapping("/{name}/culture")
    public ResponseEntity<PageDTO<EntryDTO>> getCulturesWithRelationToWorld(@PathVariable("name") String name,
                                                                            PageInfo pageInfo) {
        return ResponseEntity.ok().body(pageMapper.mapPageDataToPageDTO(worldCultureService.getCulturesRelatedToWorld(name, pageInfo)));
    }

    @GetMapping("/culture/{name}")
    public ResponseEntity<EntryDTO> getWorldRelatedToCulture(@PathVariable("name") String name) {
        return ResponseEntity.ok().body(worldCultureService.getWorldOfCulture(name));
    }

    @PostMapping("/{worldId}/culture")
    public ResponseEntity<EntryDTO> addNewCultureWorldRelation(@PathVariable("worldId") Long worldId,
                                                               @RequestBody EntryDTO culture) {
        return ResponseEntity.ok().body(worldCultureService.addNewCultureWorldRelation(worldId, culture));
    }

    @PostMapping("/Culture/{cultureId}")
    public ResponseEntity<EntryDTO> addNewWorldCultureRelation(@PathVariable("cultureId") Long cultureId,
                                                               @RequestBody EntryDTO world) {
        return ResponseEntity.ok().body(worldCultureService.addNewWorldCultureRelation(cultureId, world));
    }

    @PostMapping("/{worldId}/culture/{cultureId}")
    public ResponseEntity<HttpStatus> addWorldCultureRelation(@PathVariable("worldId") Long worldId,
                                                              @PathVariable("cultureId") Long cultureId) {
        worldCultureService.setWorldToCultureRelation(worldId, cultureId);
        return ResponseEntity.ok().build();
    }
}
