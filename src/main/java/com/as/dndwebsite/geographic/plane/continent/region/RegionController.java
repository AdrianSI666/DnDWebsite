package com.as.dndwebsite.geographic.plane.continent.region;

import com.as.dndwebsite.description.IDescriptionEntryService;
import com.as.dndwebsite.dto.DescriptionDTO;
import com.as.dndwebsite.dto.EntryDTO;
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
@RequestMapping("/regions")
@RequiredArgsConstructor
public class RegionController {
    private final IRegionService regionService;
    private final IRegionImageService regionImageService;
    private final IPageMapper pageMapper;
    @Qualifier("regionDescriptionService")
    private final IDescriptionEntryService regionDescriptionService;

    @GetMapping
    public ResponseEntity<PageDTO<EntryDTO>> getRegions(PageInfo pageInfo) {
        return ResponseEntity.ok().body(pageMapper.mapPageDataToPageDTO(regionService.getRegions(pageInfo)));
    }

    @GetMapping("/all") //TODO with security this won't be all but created by account and/or subscribed to
    public ResponseEntity<List<EntryDTO>> getAllRegions() {
        return ResponseEntity.ok().body(regionService.getAllRegions());
    }

    @GetMapping("/{name}")
    public ResponseEntity<RegionDTO> getRegionByName(@PathVariable("name") String name) {
        return ResponseEntity.ok().body(regionService.getRegion(name));
    }

    @PostMapping
    public ResponseEntity<EntryDTO> saveRegion(@RequestBody EntryDTO region) {
        return ResponseEntity.status(HttpStatus.CREATED).body(regionService.saveRegion(region));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HttpStatus> updateRegion(@RequestBody EntryDTO region,
                                                   @PathVariable("id") Long id) {
        regionService.updateRegion(region, id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteRegion(@PathVariable("id") Long id) {
        regionService.deleteRegion(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping(path = "{regionId}/image",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ImageDTO> saveImageToRegion(@PathVariable("regionId") Long regionId,
                                                      @RequestParam("image") MultipartFile imageFile) {
        return ResponseEntity.ok().body(regionImageService.saveImageToRegion(imageFile, regionId));
    }

    @DeleteMapping("/{regionId}/image/{imageId}")
    public ResponseEntity<HttpStatus> deleteImageFromRegion(@PathVariable("regionId") Long regionId,
                                                            @PathVariable("imageId") Long imageId) {
        regionImageService.deleteImageFromRegion(regionId, imageId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping(path = "{id}/description")
    public ResponseEntity<DescriptionDTO> saveDescriptionToRegion(@PathVariable("id") Long id,
                                                                  @RequestBody DescriptionDTO descriptionDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(regionDescriptionService.saveDescriptionToEntry(descriptionDTO, id));
    }

    @GetMapping(path = "{id}/description")
    public ResponseEntity<List<DescriptionDTO>> getDescriptionsOfRegion(@PathVariable("id") Long id) {
        return ResponseEntity.ok().body(regionDescriptionService.getDescriptionsOfEntry(id));
    }

    @DeleteMapping(path = "/{regionId}/description/{descriptionId}")
    public ResponseEntity<HttpStatus> deleteDescriptionFromRegion(@PathVariable("regionId") Long regionId,
                                                                  @PathVariable("descriptionId") Long imageId) {
        regionDescriptionService.deleteDescriptionFromEntry(regionId, imageId);
        return ResponseEntity.noContent().build();
    }
}