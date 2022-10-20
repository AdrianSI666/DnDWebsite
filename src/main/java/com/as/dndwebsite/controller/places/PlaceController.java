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
public class PlaceController {
    private final PlaceService placeService;
//    private final Base64.Decoder decoder = Base64.getDecoder();

    @GetMapping("/all")
    public ResponseEntity<List<Place>> getPlaces() {
        List<Place> dataToSend = placeService.getPlaces();
        return ResponseEntity.ok().body(dataToSend);
    }

    @GetMapping("/find/{name}")
    public ResponseEntity<Place> getPlaceByName(@PathVariable("name") String name) {
        Place dataToSend = placeService.getPlace(name);
        return ResponseEntity.ok().body(dataToSend);
    }

    @GetMapping("/region/{regionId}")
    public ResponseEntity<List<Place>> getPlacesRelatedToRegion(@PathVariable("regionId") Long regionId) {
        return ResponseEntity.ok().body(placeService.getPlacesRelatedToRegion(regionId));
    }

    @PostMapping("/save/{regionId}")
    public ResponseEntity<Place> savePlace(@RequestBody Place place,
                                           @PathVariable("regionId") Long regionId) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("api/role/save").toUriString());
        return ResponseEntity.created(uri).body(placeService.savePlace(place, regionId));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updatePlace(@RequestBody Place place,
                                         @PathVariable("id") Long id) {
        place.setId(id);
        placeService.updatePlace(place);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deletePlace(@PathVariable("id") Long id) {
        placeService.deletePlace(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping(path = "{placeId}/image/{regionId}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Place>> saveImageToPlace(@PathVariable("placeId") Long placeId,
                                                        @RequestParam("image") MultipartFile imageFile,
                                                        @PathVariable("regionId") Long regionId) {
        placeService.saveImageToPlace(imageFile, placeId);
        return ResponseEntity.ok().body(placeService.getPlacesRelatedToRegion(regionId));
    }

    @RequestMapping(method = RequestMethod.DELETE, path = "/delete/{placeId}/{imageId}/{regionId}")
    public ResponseEntity<List<Place>> deleteImageFromRegion(@PathVariable("placeId") Long placeId,
                                                             @PathVariable("imageId") Long imageId,
                                                             @PathVariable("regionId") Long regionId) {
        placeService.deleteImageFromPlace(placeId, imageId);
        return ResponseEntity.ok().body(placeService.getPlacesRelatedToRegion(regionId));
    }

    @RequestMapping(method = RequestMethod.PUT, path = "/race/add/{placeId}/{raceId}")
    public ResponseEntity<?> addRace(@PathVariable("placeId") Long placeId,
                                     @PathVariable("raceId") Long raceId) {
        placeService.setRaceToPlace(raceId, placeId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(method = RequestMethod.DELETE, path = "/race/remove/{placeId}/{raceId}/{regionId}")
    public ResponseEntity<List<Place>> deleteRace(@PathVariable("placeId") Long placeId,
                                                  @PathVariable("raceId") Long raceId,
                                                  @PathVariable("regionId") Long regionId) {
        placeService.removeRaceFromPlace(raceId, placeId);
        return ResponseEntity.ok().body(placeService.getPlacesRelatedToRegion(regionId));
    }

    @RequestMapping(method = RequestMethod.PUT, path = "/subrace/add/{placeId}/{subraceId}")
    public ResponseEntity<?> addSubRace(@PathVariable("placeId") Long placeId,
                                        @PathVariable("subraceId") Long subraceId) {
        placeService.setSubraceToPlace(subraceId, placeId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(method = RequestMethod.DELETE, path = "/subrace/remove/{placeId}/{subraceId}/{regionId}")
    public ResponseEntity<List<Place>> deleteSubRace(@PathVariable("placeId") Long placeId,
                                                     @PathVariable("subraceId") Long subraceId,
                                                     @PathVariable("regionId") Long regionId) {
        placeService.removeSubraceFromPlace(subraceId, placeId);
        return ResponseEntity.ok().body(placeService.getPlacesRelatedToRegion(regionId));
    }
}