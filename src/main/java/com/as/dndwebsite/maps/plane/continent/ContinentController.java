package com.as.dndwebsite.maps.plane.continent;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.EntryFullDTO;
import com.as.dndwebsite.dto.ImageDTO;
import com.as.dndwebsite.dto.PageDTO;
import com.as.dndwebsite.dto.PageInfo;
import com.as.dndwebsite.maps.plane.continent.continentkingdom.IContinentKingdomService;
import com.as.dndwebsite.maps.plane.planecontinent.IPlaneContinentService;
import com.as.dndwebsite.util.IPageMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/continents")
@RequiredArgsConstructor
public class ContinentController {
    private final IContinentService continentService;
    private final IContinentImageService continentImageService;
    private final IContinentKingdomService continentKingdomService;
    private final IPlaneContinentService planeContinentService;
    private final IPageMapper pageMapper;

    @GetMapping
    public ResponseEntity<PageDTO<EntryDTO>> getContinents(PageInfo pageInfo) {
        return ResponseEntity.ok().body(pageMapper.mapPageDataToPageDTO(continentService.getContinents(pageInfo)));
    }

    @GetMapping("/all") //TODO with security this won't be all but created by account and/or subscribed to
    public ResponseEntity<List<EntryDTO>> getAllContinents() {
        return ResponseEntity.ok().body(continentService.getAllContinents());
    }

    @GetMapping("/{name}")
    public ResponseEntity<EntryFullDTO> getContinentByName(@PathVariable("name") String name) {
        EntryDTO continent = continentService.getContinent(name);
        Optional<EntryDTO> plane = planeContinentService.getPlaneOfContinent(continent.id());
        List<EntryDTO> kingdoms = continentKingdomService.getKingdomsRelatedToContinent(continent.id());
        List<ImageDTO> imageDTOS = continentImageService.getImagesOfContinent(continent.id());
        return ResponseEntity.ok().body(new EntryFullDTO(continent, plane, kingdoms, imageDTOS));
    }

    @PostMapping
    public ResponseEntity<EntryDTO> saveContinent(@RequestBody EntryDTO continent) {
        return ResponseEntity.status(HttpStatus.CREATED).body(continentService.saveContinent(continent));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HttpStatus> updateContinent(@PathVariable("id") Long id,
                                                      @RequestBody EntryDTO continent) {
        continentService.updateContinent(continent, id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteContinent(@PathVariable("id") Long id) {
        continentService.deleteContinent(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping(path = "{continentId}/image",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ImageDTO> saveImageToContinent(@PathVariable("continentId") long continentId,
                                                         @RequestParam("image") MultipartFile imageFile) {
        return ResponseEntity.ok().body(continentImageService.saveImageToContinent(imageFile, continentId));
    }

    @DeleteMapping(path = "/{continentId}/image/{imageId}")
    public ResponseEntity<HttpStatus> deleteImageFromContinent(@PathVariable("continentId") Long continentId,
                                                               @PathVariable("imageId") Long imageId) {
        continentImageService.deleteImageFromContinent(continentId, imageId);
        return ResponseEntity.ok().build();
    }

}