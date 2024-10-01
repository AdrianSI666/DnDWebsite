package com.as.dndwebsite.world.worldcounty;

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
public class WorldCountyController {
    private final IWorldCountyService worldCountyService;
    private final IPageMapper pageMapper;

    @GetMapping("/{name}/county")
    public ResponseEntity<PageDTO<EntryDTO>> getCountiesWithRelationToWorld(@PathVariable("name") String name,
                                                                            PageInfo pageInfo) {
        return ResponseEntity.ok().body(pageMapper.mapPageDataToPageDTO(worldCountyService.getCountiesRelatedToWorld(name, pageInfo)));
    }

    @GetMapping("/county/{name}")
    public ResponseEntity<EntryDTO> getWorldRelatedToCounty(@PathVariable("name") String name) {
        return ResponseEntity.ok().body(worldCountyService.getWorldOfCounty(name));
    }

    @PostMapping("/{worldId}/county")
    public ResponseEntity<EntryDTO> addNewCountyWorldRelation(@PathVariable("worldId") Long worldId,
                                                              @RequestBody EntryDTO county) {
        return ResponseEntity.ok().body(worldCountyService.addNewCountyWorldRelation(worldId, county));
    }

    @PostMapping("/county/{countyId}")
    public ResponseEntity<EntryDTO> addNewWorldCountyRelation(@PathVariable("countyId") Long countyId,
                                                              @RequestBody EntryDTO world) {
        return ResponseEntity.ok().body(worldCountyService.addNewWorldCountyRelation(countyId, world));
    }

    @PostMapping("/{worldId}/county/{countyId}")
    public ResponseEntity<HttpStatus> addWorldCountyRelation(@PathVariable("worldId") Long worldId,
                                                             @PathVariable("countyId") Long countyId) {
        worldCountyService.setWorldToCountyRelation(worldId, countyId);
        return ResponseEntity.ok().build();
    }
}
