package com.as.dndwebsite.controller.places;

import com.as.dndwebsite.domain.places.Place;
import com.as.dndwebsite.services.places.PlaceService;
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
@RequestMapping("/place")
@RequiredArgsConstructor
@CrossOrigin("http://localhost:8091/")
public class PlaceController {
    private final PlaceService placeService;
//    private final Base64.Decoder decoder = Base64.getDecoder();

    @GetMapping("/all")
    public ResponseEntity<List<Place>> getPlaces(){
        List<Place> dataToSend=placeService.getPlaces();
        /*dataToSend.forEach(place ->
                place.getImages().forEach(image ->
                        image.setImage(decoder.decode(image.getImage()))));*/
        return ResponseEntity.ok().body(dataToSend);
    }

    @GetMapping("/find/{name}")
    public ResponseEntity<Place> getUserByName(@PathVariable("name") String name) {
        Place dataToSend = placeService.getPlace(name);
        //dataToSend.getImages().forEach(image -> image.setImage(decoder.decode(image.getImage())));
        return ResponseEntity.ok().body(dataToSend);
    }

    @PostMapping("/save")
    public ResponseEntity<Place> savePlace(@RequestBody Place place){
        URI uri=URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("api/role/save").toUriString());
        return ResponseEntity.created(uri).body(placeService.savePlace(place));
    }

    @PutMapping("/update")
    public ResponseEntity<Place> updatePlace(@RequestBody Place place){
        place.getImages().forEach(image -> {});
        return ResponseEntity.ok().body(placeService.updatePlace(place));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deletePlace(@PathVariable("id") Long id){
        placeService.deletePlace(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping(path = "{placeId}/image",
    consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
    produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> saveImageToPlace(@PathVariable("placeId") long placeId,
                                                    @RequestParam("image") MultipartFile imageFile){
        placeService.saveImageToPlace(imageFile,placeId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}