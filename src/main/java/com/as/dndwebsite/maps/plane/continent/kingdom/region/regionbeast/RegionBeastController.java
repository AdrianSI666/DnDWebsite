package com.as.dndwebsite.maps.plane.continent.kingdom.region.regionbeast;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageDTO;
import com.as.dndwebsite.dto.PageInfo;
import com.as.dndwebsite.mappers.IPageMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/regions")
@RequiredArgsConstructor
public class RegionBeastController {
    private final IRegionBeastService regionBeastService;
    private final IPageMapper pageMapper;
    @GetMapping("/{name}/beast")
    public ResponseEntity<PageDTO<EntryDTO>> getBeastsRelatedToRegion(@PathVariable("name") String name, PageInfo pageInfo){
        return ResponseEntity.ok().body(
                pageMapper.mapPageDataToPageDTO(
                        regionBeastService.getBeastsRelatedToRegion(name, pageInfo)
                )
        );
    }

//    @GetMapping("/beast/{name}")
//    public ResponseEntity<PageDTO<EntryDTO>> getRegionRelatedToBeast(@PathVariable("name") String name,PageInfo pageInfo){
//        return ResponseEntity
//                .ok()
//                .body(
//                        pageMapper.mapPageDataToPageDTO(
//                                regionBeastService.getRegionsRelatedToBeast(name,pageInfo)
//                        )
//                );
//    }

    @PostMapping("/{regionId}/beast")
    public ResponseEntity<EntryDTO> addNewBeastRegionRelation(@PathVariable("regionId") Long regionId,
                                                             @RequestBody EntryDTO beast) {
        return ResponseEntity.ok().body(regionBeastService.addNewBeastToRegion(beast, regionId));
    }

    @PostMapping("/race/{beastId}")
    public ResponseEntity<EntryDTO> addNewRegionBeastRelation(@PathVariable("beastId") Long beastId,
                                                             @RequestBody EntryDTO region) {
        return ResponseEntity.ok().body(regionBeastService.addNewRegionToBeast(region, beastId));
    }

    @PutMapping("/{regionId}/beast/{beastId}")
    public ResponseEntity<HttpStatus> addRegionBeastRelation(@PathVariable("regionId") Long regionId,
                                                            @PathVariable("beastId") Long beastId) {
        regionBeastService.addBeastToRegion(beastId, regionId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{regionId}/beast/{beastId}")
    public ResponseEntity<HttpStatus> deleteRegionBeastRelation(@PathVariable("regionId") Long regionId,
                                                               @PathVariable("beastId") Long beastId) {
        regionBeastService.removeBeastFromRegion(beastId, regionId);
        return ResponseEntity.ok().build();
    }
}
