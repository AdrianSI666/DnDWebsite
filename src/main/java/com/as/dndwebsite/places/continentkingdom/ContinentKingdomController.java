package com.as.dndwebsite.places.continentkingdom;

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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/continents")
@RequiredArgsConstructor
public class ContinentKingdomController {
    private final IContinentKingdomService continentKingdomService;
    private final IPageMapper pageMapper;
    @GetMapping("/{name}/kingdom")
    public ResponseEntity<Map<String, Object>> getKingdomsWithRelationToContinent(@PathVariable("name") String name,
                                                                               @RequestParam(defaultValue = ("number:1; size:30")) PageInfo pageInfo) {
        return ResponseEntity.ok().body(pageMapper.convertDataFromPageToMap(continentKingdomService.getKingdomsRelatedToContinent(name, pageInfo)));
    }
    @PostMapping("/{continentId}/kingdom")
    public ResponseEntity<HttpStatus> addNewKingdom(@PathVariable("continentId") Long continentId,
                                                 @RequestBody EntryDTO kingdom) {
        continentKingdomService.addNewKingdom(continentId, kingdom);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{continentId}/kingdom/{kingdomId}")
    public ResponseEntity<HttpStatus> addKingdom(@PathVariable("continentId") Long continentId,
                                                 @PathVariable("kingdomId") Long kingdomId) {
        continentKingdomService.addKingdom(continentId, kingdomId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{continentId}/kingdom/{kingdomId}")
    public ResponseEntity<HttpStatus> removeKingdom(@PathVariable("continentId") Long continentId,
                                                    @PathVariable("kingdomId") Long kingdomId) {
        continentKingdomService.removeKingdom(continentId, kingdomId);
        return ResponseEntity.ok().build();
    }
}
