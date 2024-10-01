package com.as.dndwebsite.geographic.plane.planecreaturetype;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageDTO;
import com.as.dndwebsite.dto.PageInfo;
import com.as.dndwebsite.mappers.IPageMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/planes")
@RequiredArgsConstructor
public class PlaneCreatureTypeController {
    private final IPlaneCreatureTypeService planeCreatureTypeService;
    private final IPageMapper pageMapper;

    @GetMapping("/{name}/creatureType")
    public ResponseEntity<PageDTO<EntryDTO>> getCreatureTypesRelatedToPlane(@PathVariable("name") String name,
                                                                            PageInfo pageInfo) {
        return ResponseEntity.ok().body(pageMapper.mapPageDataToPageDTO(planeCreatureTypeService.getCreatureTypesRelatedToPlane(name, pageInfo)));
    }

    @GetMapping("/creatureType/{name}")
    public ResponseEntity<PageDTO<EntryDTO>> getPlanesRelatedToCreatureType(@PathVariable("name") String name,
                                                                            PageInfo pageInfo) {
        return ResponseEntity.ok().body(pageMapper.mapPageDataToPageDTO(planeCreatureTypeService.getPlanesRelatedToCreatureType(name, pageInfo)));
    }

    @PostMapping(path = "/{planeId}/creatureType")
    public ResponseEntity<EntryDTO> addNewCreatureTypePlaneRelation(@PathVariable("planeId") Long planeId,
                                                                    @RequestBody EntryDTO creatureType) {
        return ResponseEntity.ok().body(planeCreatureTypeService.addNewCreatureTypeToPlaneRelation(creatureType, planeId));
    }

    @PostMapping(path = "/creatureType/{creatureTypeId}")
    public ResponseEntity<EntryDTO> addNewPlaneCreatureTypeRelation(@PathVariable("creatureTypeId") Long creatureTypeId,
                                                                    @RequestBody EntryDTO plane) {
        EntryDTO newPlane = planeCreatureTypeService.addNewPlaneToCreatureTypeRelation(plane, creatureTypeId);
        return ResponseEntity.ok().body(newPlane);
    }

    @PutMapping(path = "/{planeId}/creatureType/{creatureTypeId}")
    public ResponseEntity<HttpStatus> addPlaneCreatureTypeRelation(@PathVariable("planeId") Long planeId,
                                                                   @PathVariable("creatureTypeId") Long creatureType) {
        planeCreatureTypeService.addCreatureTypePlaneRelation(creatureType, planeId);
        return ResponseEntity.ok().build();
    }


    @DeleteMapping("/{planeId}/creatureType/{creatureTypeId}")
    public ResponseEntity<HttpStatus> deletePlaneCreatureTypeRelation(@PathVariable("planeId") Long planeId,
                                                                      @PathVariable("creatureTypeId") Long creatureTypeId) {
        planeCreatureTypeService.removeCreatureTypePlaneRelation(creatureTypeId, planeId);
        return ResponseEntity.noContent().build();
    }
}
