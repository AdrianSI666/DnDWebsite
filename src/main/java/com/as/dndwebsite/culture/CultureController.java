package com.as.dndwebsite.culture;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.EntryFullDTO;
import com.as.dndwebsite.dto.ImageDTO;
import com.as.dndwebsite.dto.PageInfo;
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

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cultures")
@RequiredArgsConstructor
public class CultureController {
    private final CultureService cultureService;
    private final CultureImagesService cultureImagesService;
    private final IPageMapper pageMapper;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getCultures(@RequestParam(defaultValue = ("number:1; size:30")) PageInfo pageInfo) {
        Page<EntryDTO> dataToSend = cultureService.getCultures(pageInfo);
        return ResponseEntity.ok().body(pageMapper.convertDataFromPageToMap(dataToSend));
    }

    @GetMapping("/{id}/images")
    public ResponseEntity<List<ImageDTO>> getImagesOfCulture(@PathVariable("id") long id) {
        return ResponseEntity.ok().body(cultureImagesService.getImagesOfCulture(id));
    }

    @GetMapping("/{name}")
    public ResponseEntity<EntryFullDTO> getCultureByName(@PathVariable("name") String name) {
        EntryDTO culture = cultureService.getCulture(name);
        List<ImageDTO> imageDTOS = cultureImagesService.getImagesOfCulture(culture.id());
        return ResponseEntity.ok().body(new EntryFullDTO(culture, new ArrayList<>(), imageDTOS));
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