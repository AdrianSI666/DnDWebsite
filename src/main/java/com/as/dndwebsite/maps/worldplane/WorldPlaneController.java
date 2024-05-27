package com.as.dndwebsite.maps.worldplane;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageDTO;
import com.as.dndwebsite.dto.PageInfo;
import com.as.dndwebsite.util.IPageMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/worlds")
@RequiredArgsConstructor
public class WorldPlaneController {
    private final IWorldPlaneService worldPlaneService;
    private final IPageMapper pageMapper;

    @GetMapping("/{name}/plane")
    public ResponseEntity<PageDTO<EntryDTO>> getPlanesWithRelationToWorld(@PathVariable("name") String name,
                                                                          PageInfo pageInfo) {
        return ResponseEntity.ok().body(pageMapper.mapPageDataToPageDTO(worldPlaneService.getPlanesRelatedToWorld(name, pageInfo)));
    }

    @GetMapping("/continent/{name}")
    public ResponseEntity<EntryDTO> getWorldRelatedToPlane(@PathVariable("name") String name) {
        return ResponseEntity.ok().body(worldPlaneService.getWorldOfPlane(name));
    }

    @GetMapping("/unset/plane")
    public ResponseEntity<List<EntryDTO>> getAllPlanesWithoutWorld() {
        return ResponseEntity.ok().body(worldPlaneService.getAllPlanesWithoutWorld());
    }

    @PostMapping("/{worldId}/plane")
    public ResponseEntity<EntryDTO> addNewPlaneWorldRelation(@PathVariable("worldId") Long worldId,
                                                               @RequestBody EntryDTO plane) {
        return ResponseEntity.ok().body(worldPlaneService.addNewPlaneWorldRelation(worldId, plane));
    }

    @PostMapping("/plane/{planeId}")
    public ResponseEntity<EntryDTO> addNewWorldPlaneRelation(@PathVariable("planeId") Long planeId,
                                                               @RequestBody EntryDTO world) {
        return ResponseEntity.ok().body(worldPlaneService.addNewWorldPlaneRelation(planeId, world));
    }

    @PostMapping("/{worldId}/plane/{planeId}")
    public ResponseEntity<HttpStatus> addWorldPlaneRelation(@PathVariable("worldId") Long worldId,
                                                            @PathVariable("planeId") Long planeId) {
        worldPlaneService.addPlaneWorldRelation(worldId, planeId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{worldId}/plane/{planeId}")
    public ResponseEntity<HttpStatus> removeWorldPlaneRelation(@PathVariable("worldId") Long worldId,
                                                               @PathVariable("planeId") Long planeId) {
        worldPlaneService.removePlaneWorldRelation(worldId, planeId);
        return ResponseEntity.ok().build();
    }
}
