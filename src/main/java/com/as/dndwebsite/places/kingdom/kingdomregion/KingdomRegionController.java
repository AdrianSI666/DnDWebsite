package com.as.dndwebsite.places.kingdom.kingdomregion;

import com.as.dndwebsite.dto.EntryDTO;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/kingdoms")
@RequiredArgsConstructor
public class KingdomRegionController {
    private final KingdomRegionService kingdomRegionService;
    private final IPageMapper pageMapper;
    @GetMapping("/{name}/region")
    public ResponseEntity<Map<String, Object>> getRegionsWithRelationToKingdom(@PathVariable("name") String name,
                                                                               @RequestParam(defaultValue = ("number:1; size:30")) PageInfo pageInfo) {
        return ResponseEntity.ok().body(pageMapper.convertDataFromPageToMap(kingdomRegionService.getRegionsRelatedToKingdom(name, pageInfo)));
    }

    @PostMapping("/{kingdomId}/region")
    public ResponseEntity<HttpStatus> addNewRegion(@PathVariable("kingdomId") Long kingdomId,
                                                @RequestBody EntryDTO region) {
        kingdomRegionService.addNewRegion(kingdomId, region);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{kingdomId}/region/{regionId}")
    public ResponseEntity<HttpStatus> addRegion(@PathVariable("kingdomId") Long kingdomId,
                                                   @PathVariable("regionId") Long regionId) {
        kingdomRegionService.addRegion(kingdomId, regionId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{kingdomId}/region/{regionId}")
    public ResponseEntity<HttpStatus> removeRegion(@PathVariable("regionId") Long regionId,
                                                   @PathVariable("kingdomId") Long kingdomId) {
        kingdomRegionService.removeRegion(kingdomId, regionId);
        return ResponseEntity.ok().build();
    }
}
