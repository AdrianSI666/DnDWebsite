package com.as.dndwebsite.maps.plane.continent.continentkingdom;

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
@RequestMapping("/continents")
@RequiredArgsConstructor
public class ContinentKingdomController {
    private final IContinentKingdomService continentKingdomService;
    private final IPageMapper pageMapper;

    @GetMapping("/{name}/kingdom")
    public ResponseEntity<PageDTO<EntryDTO>> getKingdomsWithRelationToContinent(@PathVariable("name") String name,
                                                                                PageInfo pageInfo) {
        return ResponseEntity.ok().body(pageMapper.mapPageDataToPageDTO(continentKingdomService.getKingdomsRelatedToContinent(name, pageInfo)));
    }

    @GetMapping("/kingdom/{name}")
    public ResponseEntity<EntryDTO> getContinentRelatedToKingdom(@PathVariable("name") String name) {
        return ResponseEntity.ok().body(continentKingdomService.getContinentOfKingdom(name));
    }

    @GetMapping("/unset/kingdom")
    public ResponseEntity<List<EntryDTO>> getAllKingdomsWithoutContinent() {
        return ResponseEntity.ok().body(continentKingdomService.getAllKingdomsWithoutContinent());
    }

    @PostMapping("/{continentId}/kingdom")
    public ResponseEntity<EntryDTO> addNewKingdomContinentRelation(@PathVariable("continentId") Long continentId,
                                                                     @RequestBody EntryDTO kingdom) {
        return ResponseEntity.ok().body(continentKingdomService.addNewKingdomContinentRelation(continentId, kingdom));
    }

    @PostMapping("/kingdom/{kingdomId}")
    public ResponseEntity<EntryDTO> addNewContinentKingdomRelation(@PathVariable("kingdomId") Long kingdomId,
                                                                     @RequestBody EntryDTO continent) {
        return ResponseEntity.ok().body(continentKingdomService.addNewContinentKingdomRelation(kingdomId, continent));
    }

    @PostMapping("/{continentId}/kingdom/{kingdomId}")
    public ResponseEntity<HttpStatus> addContinentKingdomRelation(@PathVariable("continentId") Long continentId,
                                                                  @PathVariable("kingdomId") Long kingdomId) {
        continentKingdomService.addKingdomContinentRelation(continentId, kingdomId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{continentId}/kingdom/{kingdomId}")
    public ResponseEntity<HttpStatus> removeContinentKingdomRelation(@PathVariable("continentId") Long continentId,
                                                                     @PathVariable("kingdomId") Long kingdomId) {
        continentKingdomService.removeKingdomContinentRelation(continentId, kingdomId);
        return ResponseEntity.ok().build();
    }
}
