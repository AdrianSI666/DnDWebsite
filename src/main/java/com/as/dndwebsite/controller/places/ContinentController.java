package com.as.dndwebsite.controller.places;

import com.as.dndwebsite.domain.places.Continent;
import com.as.dndwebsite.domain.places.Kingdom;
import com.as.dndwebsite.dto.ContinentWithKingdom;
import com.as.dndwebsite.services.places.ContinentService;
import com.as.dndwebsite.services.places.KingdomService;
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
@RequestMapping("/continent")
@RequiredArgsConstructor
public class ContinentController {
    private final ContinentService continentService;
    private final KingdomService kingdomService;

    @GetMapping("/all")
    public ResponseEntity<List<ContinentWithKingdom>> getContinents() {
        return ResponseEntity.ok().body(getContinentWithKingdom());
    }

    @GetMapping("/find/{name}")
    public ResponseEntity<ContinentWithKingdom> getContinentByName(@PathVariable("name") String name) {
        Continent continent = continentService.getContinent(name);
        ContinentWithKingdom dataToSend = new ContinentWithKingdom(continent,
                kingdomService.getKingdomsRelatedToContinent(continent.getId()));
        return ResponseEntity.ok().body(dataToSend);
    }

    @PostMapping("/save")
    public ResponseEntity<ContinentWithKingdom> saveContinent(@RequestBody Continent continent) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("api/role/save").toUriString());
        Continent savedContinent = continentService.saveContinent(continent);
        List<Kingdom> emptyList = new ArrayList<>();
        ContinentWithKingdom dataToSend = new ContinentWithKingdom(savedContinent,
                emptyList);
        return ResponseEntity.created(uri).body(dataToSend);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateContinent(@PathVariable("id") Long id,
                                             @RequestBody Continent continent) {
        continent.setId(id);
        continentService.updateContinent(continent);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteContinent(@PathVariable("id") Long id) {
        continentService.deleteContinent(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping(path = "{continentId}/image",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<ContinentWithKingdom>> saveImageToContinent(@PathVariable("continentId") long continentId,
                                                  @RequestParam("image") MultipartFile imageFile) {
        continentService.saveImageToContinent(imageFile, continentId);
        return ResponseEntity.ok().body(getContinentWithKingdom());
    }

    @RequestMapping(method = RequestMethod.DELETE, path = "/delete/{raceId}/{imageId}")
    public ResponseEntity<List<ContinentWithKingdom>> deleteImageFromContinent(@PathVariable("raceId") Long raceId,
                                                                     @PathVariable("imageId") Long imageId) {
        continentService.deleteImageFromRace(raceId, imageId);
        return ResponseEntity.ok().body(getContinentWithKingdom());
    }

    @RequestMapping(method = RequestMethod.PUT, path = "/kingdom/{continentId}")
    public ResponseEntity<?> addKingdom(@PathVariable("continentId") Long continentId,
                                        @RequestBody Kingdom kingdom) {
        kingdomService.addKingdomToContinent(continentId, kingdom);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(method = RequestMethod.DELETE, path = "/kingdom/{kingdomId}")
    public ResponseEntity<List<ContinentWithKingdom>> deleteKingdom(@PathVariable("kingdomId") Long kingdomId) {
        kingdomService.deleteKingdom(kingdomId);
        return ResponseEntity.ok().body(getContinentWithKingdom());
    }

    private List<ContinentWithKingdom> getContinentWithKingdom() {
        List<Continent> continents = continentService.getContinents();
        List<ContinentWithKingdom> dataToSend = new ArrayList<>();
        continents.forEach(continent ->
                dataToSend.add(
                        new ContinentWithKingdom(continent,
                                kingdomService.getKingdomsRelatedToContinent(continent.getId())
                        )));
        return dataToSend;
    }
}