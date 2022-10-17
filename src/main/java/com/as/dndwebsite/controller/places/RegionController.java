package com.as.dndwebsite.controller.places;

import com.as.dndwebsite.domain.places.Region;
import com.as.dndwebsite.services.places.RegionService;
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
@RequestMapping("/region")
@RequiredArgsConstructor
@CrossOrigin("http://localhost:8091/")
public class RegionController {
    private final RegionService regionService;
//    private final Base64.Decoder decoder = Base64.getDecoder();

    @GetMapping("/all")
    public ResponseEntity<List<Region>> getRegions(){
        List<Region> dataToSend=regionService.getRegions();
        /*dataToSend.forEach(region ->
                region.getImages().forEach(image ->
                        image.setImage(decoder.decode(image.getImage()))));*/
        return ResponseEntity.ok().body(dataToSend);
    }

    @GetMapping("/find/{name}")
    public ResponseEntity<Region> getUserByName(@PathVariable("name") String name) {
        Region dataToSend = regionService.getRegion(name);
        //dataToSend.getImages().forEach(image -> image.setImage(decoder.decode(image.getImage())));
        return ResponseEntity.ok().body(dataToSend);
    }

    @PostMapping("/save")
    public ResponseEntity<Region> saveRegion(@RequestBody Region region){
        URI uri=URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("api/role/save").toUriString());
        return ResponseEntity.created(uri).body(regionService.saveRegion(region));
    }

    @PutMapping("/update")
    public ResponseEntity<Region> updateRegion(@RequestBody Region region){
        region.getImages().forEach(image -> {});
        return ResponseEntity.ok().body(regionService.updateRegion(region));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteRegion(@PathVariable("id") Long id){
        regionService.deleteRegion(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping(path = "{regionId}/image",
    consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
    produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> saveImageToregion(@PathVariable("regionId") long regionId,
                                                    @RequestParam("image") MultipartFile imageFile){
        regionService.saveImageToRegion(imageFile,regionId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}