package com.as.dndwebsite.controller.places;

import com.as.dndwebsite.domain.places.Place;
import com.as.dndwebsite.domain.places.Region;
import com.as.dndwebsite.dto.RegionWithPlace;
import com.as.dndwebsite.dto.SettingCulture;
import com.as.dndwebsite.services.places.PlaceService;
import com.as.dndwebsite.services.places.RegionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/region")
@RequiredArgsConstructor
public class RegionController {
    private final RegionService regionService;
    private final PlaceService placeService;

    @GetMapping("/all")
    public ResponseEntity<List<RegionWithPlace>> getRegions() {
        return ResponseEntity.ok().body(getRegionWithPlace(regionService.getRegions()));
    }

    @GetMapping("/find/{name}")
    public ResponseEntity<RegionWithPlace> getRegionByName(@PathVariable("name") String name) {
        Region region = regionService.getRegion(name);
        RegionWithPlace dataToSend = new RegionWithPlace(region,
                placeService.getPlacesRelatedToRegion(region.getId()));
        return ResponseEntity.ok().body(dataToSend);
    }

    @GetMapping("/kingdom/{kingdomId}")
    public ResponseEntity<List<RegionWithPlace>> getRegionsRelatedToKingdom(@PathVariable("kingdomId") Long kingdomId) {
        return ResponseEntity.ok().body(getRegionWithPlace(regionService.getRegionsRelatedToKingdoms(kingdomId)));
    }

    @PostMapping("/save/{kingdomId}")
    public ResponseEntity<RegionWithPlace> saveRegion(@RequestBody Region region,
                                                      @PathVariable("kingdomId") Long kingdomId) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("api/role/save").toUriString());
        Region savedRegion = regionService.saveRegion(region, kingdomId);
        List<Place> emptyList = new ArrayList<>();
        RegionWithPlace dataToSend = new RegionWithPlace(savedRegion,
                emptyList);
        return ResponseEntity.created(uri).body(dataToSend);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateRegion(@RequestBody Region region,
                                          @PathVariable("id") Long id) {
        region.setId(id);
        regionService.updateRegion(region);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteRegion(@PathVariable("id") Long id) {
        regionService.deleteRegion(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping(path = "{regionId}/image/{kingdomId}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<RegionWithPlace>> saveImageToRegion(@PathVariable("regionId") Long regionId,
                                                                   @RequestParam("image") MultipartFile imageFile,
                                                                   @PathVariable("kingdomId") Long kingdomId) {
        regionService.saveImageToRegion(imageFile, regionId);
        return ResponseEntity.ok().body(getRegionWithPlace(regionService.getRegionsRelatedToKingdoms(kingdomId)));
    }

    @RequestMapping(method = RequestMethod.DELETE, path = "/delete/{regionId}/{imageId}/{kingdomId}")
    public ResponseEntity<List<RegionWithPlace>> deleteImageFromRegion(@PathVariable("regionId") Long regionId,
                                                                       @PathVariable("imageId") Long imageId,
                                                                       @PathVariable("kingdomId") Long kingdomId) {
        regionService.deleteImageFromRegion(regionId, imageId);
        return ResponseEntity.ok().body(getRegionWithPlace(regionService.getRegionsRelatedToKingdoms(kingdomId)));
    }

    @RequestMapping(method = RequestMethod.PUT, path = "/place/{regionId}")
    public ResponseEntity<?> addPlace(@PathVariable("regionId") Long regionId,
                                      @RequestBody Place place) {
        placeService.addPlaceToRegion(regionId, place);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(method = RequestMethod.DELETE, path = "/place/{placeId}/{kingdomId}")
    public ResponseEntity<List<RegionWithPlace>> deletePlace(@PathVariable("placeId") Long placeId,
                                                             @PathVariable("kingdomId") Long kingdomId) {
        placeService.deletePlace(placeId);
        return ResponseEntity.ok().body(getRegionWithPlace(regionService.getRegionsRelatedToKingdoms(kingdomId)));
    }

    @RequestMapping(method = RequestMethod.PUT, path = "/culture/add/{regionId}")
    public ResponseEntity<?> addCulture(@PathVariable("regionId") Long regionId,
                                        @RequestBody SettingCulture cultureName) {
        regionService.setCultureToRegion(cultureName.cultureName(), regionId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(method = RequestMethod.DELETE, path = "/culture/remove/{regionId}/{cultureName}/{kingdomId}")
    public ResponseEntity<List<RegionWithPlace>> deleteCulture(@PathVariable("regionId") Long regionId,
                                                               @PathVariable("cultureName") String cultureName,
                                                               @PathVariable("kingdomId") Long kingdomId) {
        regionService.removeCultureFromRegion(cultureName, regionId);
        return ResponseEntity.ok().body(getRegionWithPlace(regionService.getRegionsRelatedToKingdoms(kingdomId)));
    }

    private List<RegionWithPlace> getRegionWithPlace(List<Region> regions) {
        List<RegionWithPlace> dataToSend = new ArrayList<>();
        regions.forEach(region -> dataToSend.add(
                new RegionWithPlace(region,
                        placeService.getPlacesRelatedToRegion(region.getId()))
        ));
        return dataToSend;
    }
}