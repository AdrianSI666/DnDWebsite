package com.as.dndwebsite.places.kingdom.region.regionkingdom;

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
@RequestMapping("/regions")
@RequiredArgsConstructor
public class RegionKingdomController {
    private final IRegionKingdomService regionKingdomService;
    private final IPageMapper pageMapper;
    @GetMapping("/kingdom/{name}")
    public ResponseEntity<Map<String, Object>> getRegionsRelatedToKingdom(@PathVariable("name") String name,
                                                                          @RequestParam(defaultValue = ("number:1; size:30")) PageInfo pageInfo) {
        return ResponseEntity.ok().body(pageMapper.convertDataFromPageToMap(regionKingdomService.getRegionsRelatedToKingdom(name, pageInfo)));
    }

    @PutMapping(path = "/{regionId}/kingdom/{kingdomId}")
    public ResponseEntity<HttpStatus> addKingdom(@PathVariable("regionId") Long regionId,
                                                 @PathVariable("kingdomId") Long kingdom) {
        regionKingdomService.setKingdomToRegion(kingdom, regionId);
        return ResponseEntity.ok().build();
    }

    @PostMapping(path = "/{regionId}/kingdom")
    public ResponseEntity<HttpStatus> addNewKingdom(@PathVariable("regionId") Long regionId,
                                                    @RequestBody EntryDTO kingdom) {
        regionKingdomService.addNewKingdomToRegion(kingdom, regionId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{regionId}/kingdom/{kingdomId}")
    public ResponseEntity<HttpStatus> deleteKingdom(@PathVariable("regionId") Long regionId,
                                                    @PathVariable("kingdomId") Long kingdomId) {
        regionKingdomService.removeKingdomFromRegion(kingdomId, regionId);
        return ResponseEntity.ok().build();
    }
}
