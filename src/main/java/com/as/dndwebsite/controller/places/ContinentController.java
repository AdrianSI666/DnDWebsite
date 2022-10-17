package com.as.dndwebsite.controller.places;

import com.as.dndwebsite.domain.places.Continent;
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
@CrossOrigin("http://localhost:8091/")
public class ContinentController {
    private final ContinentService continentService;
    private final KingdomService kingdomService;

    @GetMapping("/all")
    public ResponseEntity<List<ContinentWithKingdom>> getContinents() {
        List<Continent> continents = continentService.getContinents();
        List<ContinentWithKingdom> dataToSend = new ArrayList<>();
        continents.forEach(continent ->
                dataToSend.add(
                        new ContinentWithKingdom(continent,
                                kingdomService.getKingdomsRelatedToContinent(continent.getName())
                        )));
        return ResponseEntity.ok().body(dataToSend);
    }

    @GetMapping("/find/{name}")
    public ResponseEntity<Continent> getUserByName(@PathVariable("name") String name) {
        Continent dataToSend = continentService.getContinent(name);
        return ResponseEntity.ok().body(dataToSend);
    }

    @PostMapping("/save")
    public ResponseEntity<Continent> saveContinent(@RequestBody Continent continent) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("api/role/save").toUriString());
        return ResponseEntity.created(uri).body(continentService.saveContinent(continent));
    }

    @PutMapping("/update")
    public ResponseEntity<Continent> updateContinent(@RequestBody Continent continent) {
        return ResponseEntity.ok().body(continentService.updateContinent(continent));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteContinent(@PathVariable("id") Long id) {
        continentService.deleteContinent(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping(path = "{continentId}/image",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> saveImageToContinent(@PathVariable("continentId") long continentId,
                                                  @RequestParam("image") MultipartFile imageFile) {
        continentService.saveImageToContinent(imageFile, continentId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}