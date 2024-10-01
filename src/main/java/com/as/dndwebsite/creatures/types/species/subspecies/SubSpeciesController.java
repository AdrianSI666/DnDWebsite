package com.as.dndwebsite.creatures.types.species.subspecies;

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
@RequestMapping("/subSpecies")
@RequiredArgsConstructor
public class SubSpeciesController {
    private final ISubSpeciesService subSpeciesService;
    private final ISubSpeciesImagesService subSpeciesImagesService;
    private final IPageMapper pageMapper;
    @Qualifier("subSpeciesDescriptionService")
    private final IDescriptionEntryService subSpeciesDescriptionService;

    @GetMapping
    public ResponseEntity<PageDTO<EntryDTO>> getSubSpecies(PageInfo pageInfo) {
        return ResponseEntity.ok().body(pageMapper.mapPageDataToPageDTO(subSpeciesService.getSubSpecies(pageInfo)));
    }

    @GetMapping("/all") //TODO with security this won't be all but created by account and/or subscribed to
    public ResponseEntity<List<EntryDTO>> getAllSubSpecies() {
        return ResponseEntity.ok().body(subSpeciesService.getAllSubSpecies());
    }

    @GetMapping("/{name}")
    public ResponseEntity<SubSpeciesDTO> getSubSpeciesByName(@PathVariable("name") String name) {
        return ResponseEntity.ok().body(subSpeciesService.getSubSpeciesByName(name));
    }

    @PostMapping
    public ResponseEntity<EntryDTO> saveSubSpecies(@RequestBody EntryDTO subSpecies) {
        return ResponseEntity.status(HttpStatus.CREATED).body(subSpeciesService.saveSubSpecies(subSpecies));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HttpStatus> updateSubSpecies(@PathVariable("id") Long id,
                                                       @RequestBody EntryDTO entryDTO) {
        subSpeciesService.updateSubSpecies(entryDTO, id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteSubSpecies(@PathVariable("id") Long id) {
        subSpeciesService.deleteSubSpecies(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/images")
    public ResponseEntity<List<ImageDTO>> getImagesOfSubSpecies(@PathVariable("id") Long id) {
        return ResponseEntity.ok().body(subSpeciesImagesService.getImagesOfSubSpecies(id));
    }

    @PostMapping(path = "{id}/image",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ImageDTO> saveImageToSubSpecies(@PathVariable("id") Long id,
                                                          @RequestParam("image") MultipartFile imageFile) {
        return ResponseEntity.ok().body(subSpeciesImagesService.saveImageToSubSpecies(imageFile, id));
    }

    @DeleteMapping(path = "/{id}/image/{imageId}")
    public ResponseEntity<HttpStatus> deleteImageFromSubSpecies(@PathVariable("id") Long id,
                                                                @PathVariable("imageId") Long imageId) {
        subSpeciesImagesService.deleteImageFromSubSpecies(id, imageId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping(path = "{id}/description")
    public ResponseEntity<DescriptionDTO> saveDescriptionToSubSpecies(@PathVariable("id") Long id,
                                                                      @RequestBody DescriptionDTO descriptionDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(subSpeciesDescriptionService.saveDescriptionToEntry(descriptionDTO, id));
    }

    @GetMapping(path = "{id}/description")
    public ResponseEntity<List<DescriptionDTO>> getDescriptionsOfSubSpecies(@PathVariable("id") Long id) {
        return ResponseEntity.ok().body(subSpeciesDescriptionService.getDescriptionsOfEntry(id));
    }

    @DeleteMapping(path = "/{subSpeciesId}/description/{descriptionId}")
    public ResponseEntity<HttpStatus> deleteDescriptionFromSubSpecies(@PathVariable("subSpeciesId") Long speciesId,
                                                                      @PathVariable("descriptionId") Long imageId) {
        subSpeciesDescriptionService.deleteDescriptionFromEntry(speciesId, imageId);
        return ResponseEntity.noContent().build();
    }
}