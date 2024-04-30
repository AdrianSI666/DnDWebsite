package com.as.dndwebsite.maps.plane.planecontinent;

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

@RestController
@RequestMapping("/planes")
@RequiredArgsConstructor
public class PlaneContinentController {
    private final IPlaneContinentService planeContinentService;
    private final IPageMapper pageMapper;

    @GetMapping("/{name}/continent")
    public ResponseEntity<PageDTO<EntryDTO>> getContinentsWithRelationToPlane(@PathVariable("name") String name,
                                                                              PageInfo pageInfo) {
        return ResponseEntity.ok().body(pageMapper.mapPageDataToPageDTO(planeContinentService.getContinentsRelatedToPlane(name, pageInfo)));
    }

    @GetMapping("/continent/{name}")
    public ResponseEntity<EntryDTO> getPlaneRelatedToContinent(@PathVariable("name") String name) {
        return ResponseEntity.ok().body(planeContinentService.getPlaneOfContinent(name));
    }

    @PostMapping("/{planeId}/continent")
    public ResponseEntity<HttpStatus> addNewContinentPlaneRelation(@PathVariable("planeId") Long planeId,
                                                                   @RequestBody EntryDTO continent) {
        planeContinentService.addNewContinentPlaneRelation(planeId, continent);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/continent/{continentId}")
    public ResponseEntity<HttpStatus> addNewPlaneContinentRelation(@PathVariable("continentId") Long continentId,
                                                                   @RequestBody EntryDTO plane) {
        planeContinentService.addNewPlaneContinentRelation(continentId, plane);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{planeId}/continent/{continentId}")
    public ResponseEntity<HttpStatus> addContinentPlaneRelation(@PathVariable("planeId") Long planeId,
                                                                @PathVariable("continentId") Long continentId) {
        planeContinentService.addContinentPlaneRelation(planeId, continentId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{planeId}/continent/{continentId}")
    public ResponseEntity<HttpStatus> removeContinentPlaneRelation(@PathVariable("planeId") Long planeId,
                                                                   @PathVariable("continentId") Long continentId) {
        planeContinentService.removeContinentPlaneRelation(planeId, continentId);
        return ResponseEntity.ok().build();
    }
}
