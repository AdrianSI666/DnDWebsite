package com.as.dndwebsite.controller;

import com.as.dndwebsite.domain.Culture;
import com.as.dndwebsite.services.CultureService;
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
@RequestMapping("/culture")
@RequiredArgsConstructor
public class CultureController {
    private final CultureService cultureService;

    @GetMapping("/all")
    public ResponseEntity<List<Culture>> getCultures() {
        List<Culture> dataToSend = cultureService.getCultures();
        return ResponseEntity.ok().body(dataToSend);
    }

    @GetMapping("/find/{name}")
    public ResponseEntity<Culture> getUserByName(@PathVariable("name") String name) {
        Culture dataToSend = cultureService.getCulture(name);
        return ResponseEntity.ok().body(dataToSend);
    }

    @PostMapping("/save")
    public ResponseEntity<Culture> saveCulture(@RequestBody Culture culture) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("api/role/save").toUriString());
        return ResponseEntity.created(uri).body(cultureService.saveCulture(culture));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Culture> updateCulture(@PathVariable("id") Long id,
                                                 @RequestBody Culture culture) {
        culture.setId(id);
        return ResponseEntity.ok().body(cultureService.updateCulture(culture));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteCulture(@PathVariable("id") Long id) {
        cultureService.deleteCulture(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping(path = "{cultureId}/image",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Culture>> saveImageToCulture(@PathVariable("cultureId") long cultureId,
                                                            @RequestParam("image") MultipartFile imageFile) {
        cultureService.saveImageToCulture(imageFile, cultureId);
        List<Culture> dataToSend = cultureService.getCultures();
        return ResponseEntity.ok().body(dataToSend);
    }

    @RequestMapping(method = RequestMethod.DELETE, path = "/delete/{cultureId}/{imageId}")
    public ResponseEntity<List<Culture>> deleteImageFromCulture(@PathVariable("cultureId") Long cultureId,
                                                                @PathVariable("imageId") Long imageId) {
        cultureService.deleteImageFromCulture(cultureId, imageId);
        List<Culture> dataToSend = cultureService.getCultures();
        return ResponseEntity.ok().body(dataToSend);
    }
}