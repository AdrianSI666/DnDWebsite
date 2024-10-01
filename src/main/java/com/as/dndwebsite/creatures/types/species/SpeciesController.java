package com.as.dndwebsite.creatures.types.species;

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
@RequestMapping("/species")
@RequiredArgsConstructor
public class SpeciesController {
    private final ISpeciesService speciesService;
    private final ISpeciesImagesService speciesImagesService;
    private final IPageMapper pageMapper;
    @Qualifier("speciesDescriptionService")
    private final IDescriptionEntryService speciesDescriptionService;

    @GetMapping
    public ResponseEntity<PageDTO<EntryDTO>> getSpecies(PageInfo pageInfo) {
        return ResponseEntity.ok().body(pageMapper.mapPageDataToPageDTO(speciesService.getSpecies(pageInfo)));
    }

    @GetMapping("/all") //TODO with security this won't be all but created by account and/or subscribed to
    public ResponseEntity<List<EntryDTO>> getAllSpecies() {
        return ResponseEntity.ok().body(speciesService.getAllSpeciess());
    }

    @GetMapping("/{name}")
    public ResponseEntity<SpeciesDTO> getSpeciesByName(@PathVariable("name") String name) {
        return ResponseEntity.ok().body(speciesService.getSpecies(name));
    }

    @PostMapping
    public ResponseEntity<EntryDTO> saveSpecies(@RequestBody EntryDTO species) {
        return ResponseEntity.status(HttpStatus.CREATED).body(speciesService.saveSpecies(species));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HttpStatus> updateSpecies(@PathVariable("id") Long id,
                                                    @RequestBody EntryDTO species) {
        speciesService.updateSpecies(species, id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteSpecies(@PathVariable("id") Long id) {
        speciesService.deleteSpecies(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/images")
    public ResponseEntity<List<ImageDTO>> getImagesOfSpecies(@PathVariable("id") Long id) {
        return ResponseEntity.ok().body(speciesImagesService.getImagesOfSpecies(id));
    }

    @PostMapping(path = "{speciesId}/image",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ImageDTO> saveImageToSpecies(@PathVariable("speciesId") Long speciesId,
                                                       @RequestParam("image") MultipartFile imageFile) {
        return ResponseEntity.ok().body(speciesImagesService.saveImageToSpecies(imageFile, speciesId));
    }

    @DeleteMapping("/{speciesId}/image/{imageId}")
    public ResponseEntity<HttpStatus> deleteImageFromSpecies(@PathVariable("speciesId") Long speciesId,
                                                             @PathVariable("imageId") Long imageId) {
        speciesImagesService.deleteImageFromSpecies(speciesId, imageId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping(path = "{id}/description")
    public ResponseEntity<DescriptionDTO> saveDescriptionToSpecies(@PathVariable("id") Long id,
                                                                   @RequestBody DescriptionDTO descriptionDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(speciesDescriptionService.saveDescriptionToEntry(descriptionDTO, id));
    }

    @GetMapping(path = "{id}/description")
    public ResponseEntity<List<DescriptionDTO>> getDescriptionsOfSpecies(@PathVariable("id") Long id) {
        return ResponseEntity.ok().body(speciesDescriptionService.getDescriptionsOfEntry(id));
    }

    @DeleteMapping(path = "/{speciesId}/description/{descriptionId}")
    public ResponseEntity<HttpStatus> deleteDescriptionFromSpecies(@PathVariable("speciesId") Long speciesId,
                                                                   @PathVariable("descriptionId") Long imageId) {
        speciesDescriptionService.deleteDescriptionFromEntry(speciesId, imageId);
        return ResponseEntity.noContent().build();
    }

}