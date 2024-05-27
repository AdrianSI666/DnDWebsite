package com.as.dndwebsite.maps.plane.continent.kingdom.kingdomregion;

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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/kingdoms")
@RequiredArgsConstructor
public class KingdomRegionController {
    private final IKingdomRegionService kingdomRegionService;
    private final IPageMapper pageMapper;

    @GetMapping("/{name}/region")
    public ResponseEntity<PageDTO<EntryDTO>> getRegionsWithRelationToKingdom(@PathVariable("name") String name,
                                                                             PageInfo pageInfo) {
        return ResponseEntity.ok().body(pageMapper.mapPageDataToPageDTO(kingdomRegionService.getRegionsRelatedToKingdom(name, pageInfo)));
    }

    @GetMapping("/region/{name}")
    public ResponseEntity<EntryDTO> getKingdomRelatedToRegion(@PathVariable("name") String name) {
        return ResponseEntity.ok().body(kingdomRegionService.getKingdomRelatedToRegion(name));
    }

    @GetMapping("/unset/region")
    public ResponseEntity<List<EntryDTO>> getAllRegionsWithoutKingdom() {
        return ResponseEntity.ok().body(kingdomRegionService.getAllRegionsWithoutKingdom());
    }

    @PostMapping("/{kingdomId}/region")
    public ResponseEntity<EntryDTO> addNewRegionKingdomRelation(@PathVariable("kingdomId") Long kingdomId,
                                                                  @RequestBody EntryDTO region) {
        return ResponseEntity.ok().body(kingdomRegionService.addNewRegionKingdomRelation(kingdomId, region));
    }

    @PostMapping("/region/{regionId}")
    public ResponseEntity<EntryDTO> addNewKingdomRegionRelation(@PathVariable("regionId") Long regionId,
                                                                  @RequestBody EntryDTO kingdom) {
        return ResponseEntity.ok().body(kingdomRegionService.addNewKingdomRegionRelation(kingdom, regionId));
    }

    @PutMapping("/{kingdomId}/region/{regionId}")
    public ResponseEntity<HttpStatus> addKingdomRegionRelation(@PathVariable("kingdomId") Long kingdomId,
                                                               @PathVariable("regionId") Long regionId) {
        kingdomRegionService.addRegionKingdomRelation(kingdomId, regionId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{kingdomId}/region/{regionId}")
    public ResponseEntity<HttpStatus> removeKingdomRegionRelation(@PathVariable("kingdomId") Long kingdomId,
                                                                  @PathVariable("regionId") Long regionId) {
        kingdomRegionService.removeRegionKingdomRelation(kingdomId, regionId);
        return ResponseEntity.ok().build();
    }
}
