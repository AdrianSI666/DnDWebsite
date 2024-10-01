package com.as.dndwebsite.creatures.types;

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
@RequestMapping("/creatureTypes")
@RequiredArgsConstructor
public class CreatureTypeController {
    private final ICreatureTypeService creatureTypeService;
    private final ICreatureTypeImagesService creatureTypeImagesService;
    private final IPageMapper pageMapper;
    @Qualifier("creatureTypeDescriptionService")
    private final IDescriptionEntryService creatureTypeDescriptionService;

    @GetMapping
    public ResponseEntity<PageDTO<EntryDTO>> getCreatureTypes(PageInfo pageInfo) {
        return ResponseEntity.ok().body(pageMapper.mapPageDataToPageDTO(creatureTypeService.getCreatureTypes(pageInfo)));
    }

    @GetMapping("/all") //TODO with security this won't be all but created by account and/or subscribed to
    public ResponseEntity<List<EntryDTO>> getAllCreatureTypes() {
        return ResponseEntity.ok().body(creatureTypeService.getAllCreatureTypes());
    }

    @GetMapping("/{name}")
    public ResponseEntity<CreatureTypeDTO> getFullCreatureTypeByName(@PathVariable("name") String name) {
        return ResponseEntity.ok().body(creatureTypeService.getCreatureType(name));
    }

    @PostMapping
    public ResponseEntity<EntryDTO> saveCreatureType(@RequestBody EntryDTO creatureType) {
        return ResponseEntity.status(HttpStatus.CREATED).body(creatureTypeService.saveCreatureType(creatureType));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HttpStatus> updateCreatureType(@PathVariable("id") Long id,
                                                         @RequestBody EntryDTO creatureType) {
        creatureTypeService.updateCreatureType(creatureType, id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteCreatureType(@PathVariable("id") Long id) {
        creatureTypeService.deleteCreatureType(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/images")
    public ResponseEntity<List<ImageDTO>> getImagesOfCreatureType(@PathVariable("id") Long id) {
        return ResponseEntity.ok().body(creatureTypeImagesService.getImagesOfCreatureType(id));
    }

    @PostMapping(path = "{creatureTypeId}/image",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ImageDTO> saveImageToCreatureType(@PathVariable("creatureTypeId") Long creatureTypeId,
                                                            @RequestParam("image") MultipartFile imageFile) {
        return ResponseEntity.ok().body(creatureTypeImagesService.saveImageToCreatureType(imageFile, creatureTypeId));
    }

    @DeleteMapping("/{creatureTypeId}/image/{imageId}")
    public ResponseEntity<HttpStatus> deleteImageFromCreatureType(@PathVariable("creatureTypeId") Long creatureTypeId,
                                                                  @PathVariable("imageId") Long imageId) {
        creatureTypeImagesService.deleteImageFromCreatureType(creatureTypeId, imageId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping(path = "{id}/description")
    public ResponseEntity<DescriptionDTO> saveDescriptionToCreatureType(@PathVariable("id") Long id,
                                                                        @RequestBody DescriptionDTO descriptionDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(creatureTypeDescriptionService.saveDescriptionToEntry(descriptionDTO, id));
    }

    @GetMapping(path = "{id}/description")
    public ResponseEntity<List<DescriptionDTO>> getDescriptionsOfCreatureType(@PathVariable("id") Long id) {
        return ResponseEntity.ok().body(creatureTypeDescriptionService.getDescriptionsOfEntry(id));
    }

    @DeleteMapping(path = "/{creatureTypeId}/description/{descriptionId}")
    public ResponseEntity<HttpStatus> deleteDescriptionFromCreatureType(@PathVariable("creatureTypeId") Long creatureTypeId,
                                                                        @PathVariable("descriptionId") Long imageId) {
        creatureTypeDescriptionService.deleteDescriptionFromEntry(creatureTypeId, imageId);
        return ResponseEntity.noContent().build();
    }

}