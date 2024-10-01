package com.as.dndwebsite.world.worldkingdom;

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
public class WorldKingdomController {
    private final IWorldKingdomService worldKingdomService;
    private final IPageMapper pageMapper;

    @GetMapping("/{name}/kingdom")
    public ResponseEntity<PageDTO<EntryDTO>> getKingdomsWithRelationToWorld(@PathVariable("name") String name,
                                                                          PageInfo pageInfo) {
        return ResponseEntity.ok().body(pageMapper.mapPageDataToPageDTO(worldKingdomService.getKingdomsRelatedToWorld(name, pageInfo)));
    }

    @GetMapping("/kingdom/{name}")
    public ResponseEntity<EntryDTO> getWorldRelatedToKingdom(@PathVariable("name") String name) {
        return ResponseEntity.ok().body(worldKingdomService.getWorldOfKingdom(name));
    }

    @PostMapping("/{worldId}/kingdom")
    public ResponseEntity<EntryDTO> addNewKingdomWorldRelation(@PathVariable("worldId") Long worldId,
                                                               @RequestBody EntryDTO kingdom) {
        return ResponseEntity.ok().body(worldKingdomService.addNewKingdomWorldRelation(worldId, kingdom));
    }

    @PostMapping("/kingdom/{kingdomId}")
    public ResponseEntity<EntryDTO> addNewWorldKingdomRelation(@PathVariable("kingdomId") Long kingdomId,
                                                               @RequestBody EntryDTO world) {
        return ResponseEntity.ok().body(worldKingdomService.addNewWorldKingdomRelation(kingdomId, world));
    }

    @PostMapping("/{worldId}/kingdom/{kingdomId}")
    public ResponseEntity<HttpStatus> addWorldKingdomRelation(@PathVariable("worldId") Long worldId,
                                                            @PathVariable("kingdomId") Long kingdomId) {
        worldKingdomService.setWorldToKingdomRelation(worldId, kingdomId);
        return ResponseEntity.ok().build();
    }
}
