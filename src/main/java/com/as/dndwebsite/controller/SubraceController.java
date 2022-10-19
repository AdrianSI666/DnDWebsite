package com.as.dndwebsite.controller;

import com.as.dndwebsite.domain.Subrace;
import com.as.dndwebsite.services.SubraceService;
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
@RequestMapping("/subrace")
@RequiredArgsConstructor
public class SubraceController {
    private final SubraceService subraceService;

    @GetMapping("/all")
    public ResponseEntity<List<Subrace>> getSubraces() {
        List<Subrace> dataToSend = subraceService.getSubraces();
        return ResponseEntity.ok().body(dataToSend);
    }

    @GetMapping("/find/{name}")
    public ResponseEntity<Subrace> getSubraceByName(@PathVariable("name") String name) {
        Subrace dataToSend = subraceService.getSubrace(name);
        return ResponseEntity.ok().body(dataToSend);
    }

    @GetMapping("/race/{id}")
    public ResponseEntity<List<Subrace>> getSubracesWithRelationToRace(@PathVariable("id") Long id) {
        List<Subrace> dataToSend = subraceService.getSubracesInRelationToRace(id);
        return ResponseEntity.ok().body(dataToSend);
    }

    @PostMapping("/save/race/{id}")
    public ResponseEntity<Subrace> saveSubrace(@RequestBody Subrace subrace,
                                               @PathVariable("id") Long id) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("api/role/save").toUriString());
        return ResponseEntity.created(uri).body(subraceService.saveSubrace(subrace, id));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateSubrace(@PathVariable("id") Long id,
                                                 @RequestBody Subrace subrace) {
        subrace.setId(id);
        subraceService.updateSubrace(subrace);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteSubrace(@PathVariable("id") Long id) {
        subraceService.deleteSubrace(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping(path = "{subraceId}/image/{raceId}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Subrace>> saveImageToSubrace(@PathVariable("subraceId") Long subraceId,
                                                            @RequestParam("image") MultipartFile imageFile,
                                                            @PathVariable("raceId") Long raceId) {
        subraceService.saveImageToSubrace(imageFile, subraceId);
        List<Subrace> dataToSend = subraceService.getSubracesInRelationToRace(raceId);
        return ResponseEntity.ok().body(dataToSend);
    }

    @RequestMapping(method = RequestMethod.DELETE, path = "/delete/{subraceId}/{imageId}/{raceId}")
    public ResponseEntity<List<Subrace>> deleteImageFromSubrace(@PathVariable("subraceId") Long subraceId,
                                                                @PathVariable("imageId") Long imageId,
                                                                @PathVariable("raceId") Long raceId) {
        subraceService.deleteImageFromSubrace(subraceId, imageId);
        List<Subrace> dataToSend = subraceService.getSubracesInRelationToRace(raceId);
        return ResponseEntity.ok().body(dataToSend);
    }
}