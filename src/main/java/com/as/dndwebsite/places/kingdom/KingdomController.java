package com.as.dndwebsite.places.kingdom;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.EntryFullDTO;
import com.as.dndwebsite.dto.ImageDTO;
import com.as.dndwebsite.dto.PageInfo;
import com.as.dndwebsite.places.kingdom.kingdomcontinent.IKingdomContinentService;
import com.as.dndwebsite.places.kingdom.kingdomregion.IKingdomRegionService;
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
import java.util.Map;

@RestController
@RequestMapping("/kingdoms")
@RequiredArgsConstructor
public class KingdomController {
    private final IKingdomService kingdomService;
    private final IKingdomImageService kingdomImageService;
    private final IKingdomContinentService kingdomContinentService;
    private final IKingdomRegionService kingdomRegionService;
    private final IPageMapper pageMapper;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getKingdoms(@RequestParam(defaultValue = ("number:1; size:30")) PageInfo pageInfo) {
        return ResponseEntity.ok().body(pageMapper.convertDataFromPageToMap(kingdomService.getKingdoms(pageInfo)));
    }

    @GetMapping("/{name}")
    public ResponseEntity<EntryFullDTO> getKingdomByName(@PathVariable("name") String name) {
        EntryDTO kingdom = kingdomService.getKingdom(name);
        EntryDTO continent = kingdomContinentService.getContinentOfKingdom(kingdom.id());
        List<EntryDTO> regions = kingdomRegionService.getRegionsRelatedToKingdom(kingdom.id());
        List<ImageDTO> imageDTOS = kingdomImageService.getImagesOfKingdom(kingdom.id());
        return ResponseEntity.ok().body(new EntryFullDTO(kingdom, continent, regions, imageDTOS));
    }

    @PostMapping
    public ResponseEntity<EntryDTO> saveKingdom(@RequestBody EntryDTO kingdom) {
        return ResponseEntity.status(HttpStatus.CREATED).body(kingdomService.saveKingdom(kingdom));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HttpStatus> updateKingdom(@PathVariable("id") Long id,
                                                    @RequestBody EntryDTO kingdom) {
        kingdomService.updateKingdom(kingdom, id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteKingdom(@PathVariable("id") Long id) {
        kingdomService.deleteKingdom(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping(path = "{kingdomId}/image",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ImageDTO> saveImageToKingdom(@PathVariable("kingdomId") Long kingdomId,
                                                       @RequestParam("image") MultipartFile imageFile) {

        return ResponseEntity.ok().body(kingdomImageService.saveImageToKingdom(imageFile, kingdomId));
    }

    @DeleteMapping("/{kingdomId}/image/{imageId}")
    public ResponseEntity<HttpStatus> deleteImageFromContinent(@PathVariable("kingdomId") Long kingdomId,
                                                                            @PathVariable("imageId") Long imageId) {
        kingdomImageService.deleteImageFromKingdom(kingdomId, imageId);
        return ResponseEntity.ok().build();
    }
}