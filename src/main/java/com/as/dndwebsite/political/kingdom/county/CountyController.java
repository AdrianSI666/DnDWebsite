package com.as.dndwebsite.political.kingdom.county;

import com.as.dndwebsite.description.IDescriptionEntryService;
import com.as.dndwebsite.dto.DescriptionDTO;
import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.EntryFullDTO;
import com.as.dndwebsite.dto.ImageDTO;
import com.as.dndwebsite.dto.PageDTO;
import com.as.dndwebsite.dto.PageInfo;
import com.as.dndwebsite.mappers.IPageMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
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
@RequestMapping("/counties")
@RequiredArgsConstructor
public class CountyController {
    private final ICountyService countyService;
    private final ICountyImageService countyImageService;
    private final IPageMapper pageMapper;
    @Qualifier("countyDescriptionService")
    private final IDescriptionEntryService countyDescriptionService;

    @GetMapping
    public ResponseEntity<PageDTO<EntryDTO>> getCounties(PageInfo pageInfo) {
        return ResponseEntity.ok().body(pageMapper.mapPageDataToPageDTO(countyService.getCounties(pageInfo)));
    }

    @GetMapping("/all") //TODO with security this won't be all but created by account and/or subscribed to
    public ResponseEntity<List<EntryDTO>> getAllCounties() {
        return ResponseEntity.ok().body(countyService.getAllCounties());
    }

    @GetMapping("/{name}")
    public ResponseEntity<EntryFullDTO> getCountyByName(@PathVariable("name") String name) {
        return ResponseEntity.ok().body(countyService.getCounty(name));
    }

    @PostMapping
    public ResponseEntity<EntryDTO> saveCounty(@RequestBody EntryDTO county) {
        return ResponseEntity.status(HttpStatus.CREATED).body(countyService.saveCounty(county));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HttpStatus> updateCounty(@PathVariable("id") Long id,
                                                   @RequestBody EntryDTO county) {
        countyService.updateCounty(county, id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteCounty(@PathVariable("id") Long id) {
        countyService.deleteCounty(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping(path = "{CountyId}/image",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ImageDTO> saveImageToCounty(@PathVariable("CountyId") Long countyId,
                                                      @RequestParam("image") MultipartFile imageFile) {

        return ResponseEntity.ok().body(countyImageService.saveImageToCounty(imageFile, countyId));
    }

    @DeleteMapping("/{CountyId}/image/{imageId}")
    public ResponseEntity<HttpStatus> deleteImageFromCounty(@PathVariable("CountyId") Long countyId,
                                                            @PathVariable("imageId") Long imageId) {
        countyImageService.deleteImageFromCounty(countyId, imageId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping(path = "{id}/description")
    public ResponseEntity<DescriptionDTO> saveDescriptionToCounty(@PathVariable("id") Long id,
                                                                  @RequestBody DescriptionDTO descriptionDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(countyDescriptionService.saveDescriptionToEntry(descriptionDTO, id));
    }

    @GetMapping(path = "{id}/description")
    public ResponseEntity<List<DescriptionDTO>> getDescriptionsOfCounty(@PathVariable("id") Long id) {
        return ResponseEntity.ok().body(countyDescriptionService.getDescriptionsOfEntry(id));
    }

    @DeleteMapping(path = "/{CountyId}/description/{descriptionId}")
    public ResponseEntity<HttpStatus> deleteDescriptionFromCounty(@PathVariable("CountyId") Long countyId,
                                                                  @PathVariable("descriptionId") Long imageId) {
        countyDescriptionService.deleteDescriptionFromEntry(countyId, imageId);
        return ResponseEntity.noContent().build();
    }
}