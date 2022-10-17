package com.as.dndwebsite.controller.places;

import com.as.dndwebsite.domain.places.Kingdom;
import com.as.dndwebsite.services.places.KingdomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/kingdom")
@RequiredArgsConstructor
@CrossOrigin("http://localhost:8091/")
public class KingdomController {
    private final KingdomService kingdomService;
//    private final Base64.Decoder decoder = Base64.getDecoder();

    @GetMapping("/all")
    public ResponseEntity<List<Kingdom>> getKingdoms(){
        List<Kingdom> dataToSend=kingdomService.getkingdoms();
        /*dataToSend.forEach(kingdom ->
                kingdom.getImages().forEach(image ->
                        image.setImage(decoder.decode(image.getImage()))));*/
        return ResponseEntity.ok().body(dataToSend);
    }

    @GetMapping("/find/{name}")
    public ResponseEntity<Kingdom> getUserByName(@PathVariable("name") String name) {
        Kingdom dataToSend = kingdomService.getkingdom(name);
        //dataToSend.getImages().forEach(image -> image.setImage(decoder.decode(image.getImage())));
        return ResponseEntity.ok().body(dataToSend);
    }

    @PostMapping("/save")
    public ResponseEntity<Kingdom> saveKingdom(@RequestBody Kingdom kingdom){
        URI uri=URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("api/role/save").toUriString());
        return ResponseEntity.created(uri).body(kingdomService.savekingdom(kingdom));
    }

    @PutMapping("/update")
    public ResponseEntity<Kingdom> updateKingdom(@RequestBody Kingdom kingdom){
        kingdom.getImages().forEach(image -> {});
        return ResponseEntity.ok().body(kingdomService.updatekingdom(kingdom));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteKingdom(@PathVariable("id") Long id){
        kingdomService.deletekingdom(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping(path = "{kingdomId}/image",
    consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
    produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> saveImageToKingdom(@PathVariable("kingdomId") long kingdomId,
                                                    @RequestParam("image") MultipartFile imageFile){
        kingdomService.saveImageToKingdom(imageFile,kingdomId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}