package com.as.dndwebsite.maps;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.EntryFullDTO;
import com.as.dndwebsite.dto.ImageDTO;
import com.as.dndwebsite.dto.PageDTO;
import com.as.dndwebsite.dto.PageInfo;
import com.as.dndwebsite.maps.worldplane.IWorldPlaneService;
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
@RequestMapping("/worlds")
@RequiredArgsConstructor
public class WorldController {
    private final IWorldService worldService;
    private final IWorldImageService worldImagesService;
    private final IPageMapper pageMapper;
    private final IWorldPlaneService worldPlaneService;

    @GetMapping
    public ResponseEntity<PageDTO<EntryDTO>> getWorlds(PageInfo pageInfo) {
        return ResponseEntity.ok().body(pageMapper.mapPageDataToPageDTO(worldService.getWorlds(pageInfo)));
    }

    @GetMapping("/all") //TODO with security this won't be all but created by account and/or subscribed to
    public ResponseEntity<List<EntryDTO>> getAllWorlds() {
        return ResponseEntity.ok().body(worldService.getAllWorlds());
    }

    @GetMapping("/{name}")
    public ResponseEntity<EntryFullDTO> getWorldByName(@PathVariable("name") String name) {
        EntryDTO world = worldService.getWorld(name);
        List<EntryDTO> planes = worldPlaneService.getPlanesRelatedToWorld(world.id());
        List<ImageDTO> imageDTOS = worldImagesService.getImagesOfWorld(world.id());
        return ResponseEntity.ok().body(new EntryFullDTO(world, null, planes, imageDTOS));
    }

    @PostMapping
    public ResponseEntity<EntryDTO> saveWorld(@RequestBody EntryDTO world) {
        return ResponseEntity.status(HttpStatus.CREATED).body(worldService.saveWorld(world));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HttpStatus> updateWorld(@PathVariable("id") Long id,
                                                  @RequestBody EntryDTO world) {
        worldService.updateWorld(world, id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteWorld(@PathVariable("id") Long id) {
        worldService.deleteWorld(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/images")
    public ResponseEntity<List<ImageDTO>> getImagesOfWorld(@PathVariable("id") long id) {
        return ResponseEntity.ok().body(worldImagesService.getImagesOfWorld(id));
    }

    @PostMapping(path = "{worldId}/image",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ImageDTO> saveImageToWorld(@PathVariable("worldId") Long worldId,
                                                     @RequestParam("image") MultipartFile imageFile) {
        return ResponseEntity.ok().body(worldImagesService.saveImageToWorld(imageFile, worldId));
    }

    @DeleteMapping("/{worldId}/image/{imageId}")
    public ResponseEntity<HttpStatus> deleteImageFromWorld(@PathVariable("worldId") Long worldId,
                                                           @PathVariable("imageId") Long imageId) {
        worldImagesService.deleteImageFromWorld(worldId, imageId);
        return ResponseEntity.ok().build();
    }
}
