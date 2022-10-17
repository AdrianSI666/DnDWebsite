package com.as.dndwebsite.controller.places;

import com.as.dndwebsite.domain.places.Kingdom;
import com.as.dndwebsite.domain.places.Region;
import com.as.dndwebsite.dto.KingdomWithRegion;
import com.as.dndwebsite.services.places.KingdomService;
import com.as.dndwebsite.services.places.RegionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/kingdom")
@RequiredArgsConstructor
@CrossOrigin("http://localhost:8091/")
public class KingdomController {
    private final KingdomService kingdomService;
    private final RegionService regionService;

    @GetMapping("/all")
    public ResponseEntity<List<KingdomWithRegion>> getKingdoms() {
        return ResponseEntity.ok().body(getKingdomWithRegion(kingdomService.getKingdoms()));
    }

    @GetMapping("/find/{name}")
    public ResponseEntity<KingdomWithRegion> getKingdomByName(@PathVariable("name") String name) {
        Kingdom kingdom = kingdomService.getKingdom(name);
        KingdomWithRegion dataToSend = new KingdomWithRegion(kingdom,
                regionService.getRegionsRelatedToKingdoms(kingdom.getId()));
        return ResponseEntity.ok().body(dataToSend);
    }

    @GetMapping("/continent/{continentId}")
    public ResponseEntity<List<KingdomWithRegion>> getKingdomsWithRelationToContinent(@PathVariable("continentId") Long id) {
        return ResponseEntity.ok().body(getKingdomWithRegion(kingdomService.getKingdomsRelatedToContinent(id)));
    }

    @PostMapping("/save/{continentId}")
    public ResponseEntity<KingdomWithRegion> saveKingdom(@RequestBody Kingdom kingdom,
                                                         @PathVariable("continentId") Long continentId) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("api/role/save").toUriString());
        Kingdom savedKingdom = kingdomService.saveKingdom(kingdom, continentId);
        List<Region> emptyList = new ArrayList<>();
        KingdomWithRegion dataToSend = new KingdomWithRegion(savedKingdom,
                emptyList);
        return ResponseEntity.created(uri).body(dataToSend);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateKingdom(@PathVariable("id") Long id,
                                           @RequestBody Kingdom kingdom) {
        kingdom.setId(id);
        kingdomService.updateKingdom(kingdom);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteKingdom(@PathVariable("id") Long id) {
        kingdomService.deleteKingdom(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping(path = "{kingdomId}/image",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<KingdomWithRegion>> saveImageToKingdom(@PathVariable("kingdomId") Long kingdomId,
                                                                      @RequestParam("image") MultipartFile imageFile) {
        kingdomService.saveImageToKingdom(imageFile, kingdomId);
        return ResponseEntity.ok().body(getKingdomWithRegion(kingdomService.getKingdoms()));
    }

    @RequestMapping(method = RequestMethod.DELETE, path = "/delete/{kingdomId}/{imageId}")
    public ResponseEntity<List<KingdomWithRegion>> deleteImageFromContinent(@PathVariable("kingdomId") Long kingdomId,
                                                                            @PathVariable("imageId") Long imageId) {
        kingdomService.deleteImageFromKingdom(kingdomId, imageId);
        return ResponseEntity.ok().body(getKingdomWithRegion(kingdomService.getKingdoms()));
    }

    @RequestMapping(method = RequestMethod.PUT, path = "/region/{kingdomId}")
    public ResponseEntity<?> addRegion(@PathVariable("kingdomId") Long kingdomId,
                                       @RequestBody Region region) {
        regionService.addRegionToKingdom(kingdomId, region);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(method = RequestMethod.DELETE, path = "/region/{regionId}")
    public ResponseEntity<List<KingdomWithRegion>> deleteRegion(@PathVariable("regionId") Long regionId) {
        regionService.deleteRegion(regionId);
        return ResponseEntity.ok().body(getKingdomWithRegion(kingdomService.getKingdoms()));
    }

    private List<KingdomWithRegion> getKingdomWithRegion(List<Kingdom> kingdoms) {
        List<KingdomWithRegion> dataToSend = new ArrayList<>();
        kingdoms.forEach(kingdom ->
                dataToSend.add(
                        new KingdomWithRegion(kingdom,
                                regionService.getRegionsRelatedToKingdoms(kingdom.getId())
                        )));
        return dataToSend;
    }
}