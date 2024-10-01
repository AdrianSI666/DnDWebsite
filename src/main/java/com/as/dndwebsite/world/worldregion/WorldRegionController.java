package com.as.dndwebsite.world.worldregion;

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
public class WorldRegionController {
    private final IWorldRegionService worldRegionService;
    private final IPageMapper pageMapper;

    @GetMapping("/{name}/region")
    public ResponseEntity<PageDTO<EntryDTO>> getRegionsWithRelationToWorld(@PathVariable("name") String name,
                                                                           PageInfo pageInfo) {
        return ResponseEntity.ok().body(pageMapper.mapPageDataToPageDTO(worldRegionService.getRegionsRelatedToWorld(name, pageInfo)));
    }

    @GetMapping("/region/{name}")
    public ResponseEntity<EntryDTO> getWorldRelatedToRegion(@PathVariable("name") String name) {
        return ResponseEntity.ok().body(worldRegionService.getWorldOfRegion(name));
    }

    @PostMapping("/{worldId}/region")
    public ResponseEntity<EntryDTO> addNewRegionWorldRelation(@PathVariable("worldId") Long worldId,
                                                              @RequestBody EntryDTO region) {
        return ResponseEntity.ok().body(worldRegionService.addNewRegionWorldRelation(worldId, region));
    }

    @PostMapping("/region/{regionId}")
    public ResponseEntity<EntryDTO> addNewWorldRegionRelation(@PathVariable("regionId") Long regionId,
                                                              @RequestBody EntryDTO world) {
        return ResponseEntity.ok().body(worldRegionService.addNewWorldRegionRelation(regionId, world));
    }

    @PostMapping("/{worldId}/region/{regionId}")
    public ResponseEntity<HttpStatus> addWorldRegionRelation(@PathVariable("worldId") Long worldId,
                                                             @PathVariable("regionId") Long regionId) {
        worldRegionService.setWorldToRegionRelation(worldId, regionId);
        return ResponseEntity.ok().build();
    }
}
