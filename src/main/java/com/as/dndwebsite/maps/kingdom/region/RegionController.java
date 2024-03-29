package com.as.dndwebsite.maps.kingdom.region;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.ImageDTO;
import com.as.dndwebsite.dto.PageDTO;
import com.as.dndwebsite.dto.PageInfo;
import com.as.dndwebsite.maps.kingdom.kingdomregion.IKingdomRegionService;
import com.as.dndwebsite.maps.kingdom.region.regionculture.IRegionCultureService;
import com.as.dndwebsite.maps.kingdom.region.regionplace.IRegionPlaceService;
import com.as.dndwebsite.maps.kingdom.region.regionrace.IRegionRaceService;
import com.as.dndwebsite.maps.kingdom.region.regionsubrace.IRegionSubRaceService;
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

@RestController
@RequestMapping("/regions")
@RequiredArgsConstructor
public class RegionController {
    private final IRegionService regionService;
    private final IRegionImageService regionImageService;
    private final IKingdomRegionService kingdomRegionService;
    private final IRegionPlaceService regionPlaceService;
    private final IRegionCultureService regionCultureService;
    private final IRegionRaceService regionRaceService;
    private final IRegionSubRaceService regionSubRaceService;
    private final IPageMapper pageMapper;

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
        EntryDTO region = regionService.getRegion(name);
        EntryDTO kingdom = kingdomRegionService.getKingdomOfRegion(region.id());
        List<EntryDTO> places = regionPlaceService.getPlacesRelatedToRegion(region.id());
        List<ImageDTO> imageDTOS = regionImageService.getImagesOfRegion(region.id());
        List<EntryDTO> cultures = regionCultureService.getCulturesRelatedToRegion(region.id());
        List<EntryDTO> races = regionRaceService.getRacesRelatedToRegion(region.id());
        List<EntryDTO> subRaces = regionSubRaceService.getSubRacesRelatedToRegion(region.id());
        return ResponseEntity.ok().body(new RegionDTO(region, kingdom, places, imageDTOS, cultures, races, subRaces));
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
        return ResponseEntity.ok().build();
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
        return ResponseEntity.ok().build();
    }
}