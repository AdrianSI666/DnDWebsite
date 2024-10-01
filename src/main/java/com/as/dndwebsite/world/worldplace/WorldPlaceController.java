package com.as.dndwebsite.world.worldplace;

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
public class WorldPlaceController {
    private final IWorldPlaceService worldPlaceService;
    private final IPageMapper pageMapper;

    @GetMapping("/{name}/place")
    public ResponseEntity<PageDTO<EntryDTO>> getPlacesWithRelationToWorld(@PathVariable("name") String name,
                                                                          PageInfo pageInfo) {
        return ResponseEntity.ok().body(pageMapper.mapPageDataToPageDTO(worldPlaceService.getPlacesRelatedToWorld(name, pageInfo)));
    }

    @GetMapping("/place/{name}")
    public ResponseEntity<EntryDTO> getWorldRelatedToPlace(@PathVariable("name") String name) {
        return ResponseEntity.ok().body(worldPlaceService.getWorldOfPlace(name));
    }

    @PostMapping("/{worldId}/place")
    public ResponseEntity<EntryDTO> addNewPlaceWorldRelation(@PathVariable("worldId") Long worldId,
                                                               @RequestBody EntryDTO place) {
        return ResponseEntity.ok().body(worldPlaceService.addNewPlaceWorldRelation(worldId, place));
    }

    @PostMapping("/place/{placeId}")
    public ResponseEntity<EntryDTO> addNewWorldPlaceRelation(@PathVariable("placeId") Long placeId,
                                                               @RequestBody EntryDTO world) {
        return ResponseEntity.ok().body(worldPlaceService.addNewWorldPlaceRelation(placeId, world));
    }

    @PostMapping("/{worldId}/place/{placeId}")
    public ResponseEntity<HttpStatus> addWorldPlaceRelation(@PathVariable("worldId") Long worldId,
                                                            @PathVariable("placeId") Long placeId) {
        worldPlaceService.setWorldToPlaceRelation(worldId, placeId);
        return ResponseEntity.ok().build();
    }
}
