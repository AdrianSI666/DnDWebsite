package com.as.dndwebsite.political.kingdom.kingdomcounty;

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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/kingdoms")
@RequiredArgsConstructor
public class KingdomCountyController {
    private final IKingdomCountyService kingdomCountyService;
    private final IPageMapper pageMapper;

    @GetMapping("/{name}/county")
    public ResponseEntity<PageDTO<EntryDTO>> getCountiesWithRelationToKingdom(@PathVariable("name") String name,
                                                                              PageInfo pageInfo) {
        return ResponseEntity.ok().body(pageMapper.mapPageDataToPageDTO(kingdomCountyService.getCountiesRelatedToKingdom(name, pageInfo)));
    }

    @GetMapping("/county/{name}")
    public ResponseEntity<EntryDTO> getKingdomRelatedToCounty(@PathVariable("name") String name) {
        return ResponseEntity.ok().body(kingdomCountyService.getKingdomOfCounty(name));
    }

    @PostMapping("/{kingdomId}/county")
    public ResponseEntity<EntryDTO> addNewCountyKingdomRelation(@PathVariable("kingdomId") Long kingdomId,
                                                                   @RequestBody EntryDTO county) {
        return ResponseEntity.ok().body(kingdomCountyService.addNewCountyKingdomRelation(kingdomId, county));
    }

    @PostMapping("/county/{countyId}")
    public ResponseEntity<EntryDTO> addNewKingdomCountyRelation(@PathVariable("countyId") Long countyId,
                                                                   @RequestBody EntryDTO kingdom) {
        return ResponseEntity.ok().body(kingdomCountyService.addNewKingdomCountyRelation(countyId, kingdom));
    }

    @GetMapping("/unset/county")
    public ResponseEntity<List<EntryDTO>> getAllCountiesWithoutKingdom() {
        return ResponseEntity.ok().body(kingdomCountyService.getAllCountiesWithoutKingdom());
    }

    @PostMapping("/{kingdomId}/county/{countyId}")
    public ResponseEntity<HttpStatus> addKingdomCountyRelation(@PathVariable("kingdomId") Long kingdomId,
                                                                @PathVariable("countyId") Long countyId) {
        kingdomCountyService.addCountyKingdomRelation(kingdomId, countyId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{kingdomId}/county/{countyId}")
    public ResponseEntity<HttpStatus> removeKingdomCountyRelation(@PathVariable("kingdomId") Long kingdomId,
                                                                   @PathVariable("countyId") Long countyId) {
        kingdomCountyService.removeCountyKingdomRelation(kingdomId, countyId);
        return ResponseEntity.noContent().build();
    }
}
