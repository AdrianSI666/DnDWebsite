package com.as.dndwebsite.places.kingdom.kingdomcontinent;

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
public class KingdomContinentController {
    private final KingdomContinentService kingdomContinentService;
    private final IPageMapper pageMapper;

    @GetMapping("/continent/{name}")
    public ResponseEntity<Map<String, Object>> getKingdomsWithRelationToContinent(@PathVariable("name") String name,
                                                                                  @RequestParam(defaultValue = ("number:1; size:30")) PageInfo pageInfo) {
        return ResponseEntity.ok().body(pageMapper.convertDataFromPageToMap(kingdomContinentService.getKingdomsRelatedToContinent(name, pageInfo)));
    }

    @PutMapping("/{kingdomId}/continent/{continentId}")
    public ResponseEntity<HttpStatus> setContinent(@PathVariable("kingdomId") Long kingdomId,
                                                   @PathVariable("continentId") Long continentId) {
        kingdomContinentService.setContinent(kingdomId, continentId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{kingdomId}/continent")
    public ResponseEntity<HttpStatus> addNewContinent(@PathVariable("kingdomId") Long kingdomId,
                                                   @RequestBody EntryDTO continent) {
        kingdomContinentService.addNewContinent(kingdomId, continent);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{kingdomId}/continent/{continentId}")
    public ResponseEntity<HttpStatus> removeContinent(@PathVariable("kingdomId") Long kingdomId,
                                                      @PathVariable("continentId") Long continentId) {
        kingdomContinentService.removeContinent(kingdomId, continentId);
        return ResponseEntity.ok().build();
    }
}
