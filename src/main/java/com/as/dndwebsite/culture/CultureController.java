package com.as.dndwebsite.culture;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.EntryFullDTO;
import com.as.dndwebsite.dto.ImageDTO;
import com.as.dndwebsite.dto.PageDTO;
import com.as.dndwebsite.dto.PageInfo;
import com.as.dndwebsite.maps.plane.continent.kingdom.region.regionculture.IRegionCultureService;
import com.as.dndwebsite.util.IPageMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
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

@RestController
@RequestMapping("/cultures")
@RequiredArgsConstructor
public class CultureController {
    private final ICultureService cultureService;
    private final ICultureImagesService cultureImagesService;
    private final IRegionCultureService regionCultureService;
    private final IPageMapper pageMapper;

    @GetMapping
    public ResponseEntity<PageDTO<EntryDTO>> getCultures(PageInfo pageInfo) {
        Page<EntryDTO> dataToSend = cultureService.getCultures(pageInfo);
        return ResponseEntity.ok().body(pageMapper.mapPageDataToPageDTO(dataToSend));
    }

    @GetMapping("/all") //TODO with security this won't be all but created by account and/or subscribed to
    public ResponseEntity<List<EntryDTO>> getAllCultures() {
        return ResponseEntity.ok().body(cultureService.getAllCultures());
    }

    @GetMapping("/{id}/images")
    public ResponseEntity<List<ImageDTO>> getImagesOfCulture(@PathVariable("id") long id) {
        return ResponseEntity.ok().body(cultureImagesService.getImagesOfCulture(id));
    }

    @GetMapping("/{name}")
    public ResponseEntity<EntryFullDTO> getCultureByName(@PathVariable("name") String name) {
        EntryDTO culture = cultureService.getCulture(name);
        List<ImageDTO> imageDTOS = cultureImagesService.getImagesOfCulture(culture.id());
        List<EntryDTO> regions = regionCultureService.getRegionsRelatedToCulture(culture.id());
        return ResponseEntity.ok().body(new EntryFullDTO(culture, null, regions, imageDTOS));
    }

    @PostMapping
    public ResponseEntity<EntryDTO> saveCulture(@RequestBody EntryDTO culture) {
        return ResponseEntity.status(HttpStatus.CREATED).body(cultureService.saveCulture(culture));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EntryDTO> updateCulture(@PathVariable("id") Long id,
                                                  @RequestBody EntryDTO culture) {
        cultureService.updateCulture(culture, id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteCulture(@PathVariable("id") Long id) {
        cultureService.deleteCulture(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping(path = "{id}/image",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ImageDTO> saveImageToCulture(@PathVariable("id") long cultureId,
                                                       @RequestParam("image") MultipartFile imageFile) {
        return ResponseEntity.ok().body(cultureImagesService.saveImageToCulture(imageFile, cultureId));
    }

    @DeleteMapping(path = "/{cultureId}/image/{imageId}")
    public ResponseEntity<HttpStatus> deleteImageFromCulture(@PathVariable("cultureId") Long cultureId,
                                                    @PathVariable("imageId") Long imageId) {
        cultureImagesService.deleteImageFromCulture(cultureId, imageId);
        return ResponseEntity.ok().build();
    }
}