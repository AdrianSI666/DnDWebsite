package com.as.dndwebsite.political.kingdom;

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
@RequestMapping("/kingdoms")
@RequiredArgsConstructor
public class KingdomController {
    private final IKingdomService kingdomService;
    private final IKingdomImageService kingdomImageService;
    private final IPageMapper pageMapper;
    @Qualifier("kingdomDescriptionService")
    private final IDescriptionEntryService kingdomDescriptionService;

    @GetMapping
    public ResponseEntity<PageDTO<EntryDTO>> getKingdoms(PageInfo pageInfo) {
        return ResponseEntity.ok().body(pageMapper.mapPageDataToPageDTO(kingdomService.getKingdoms(pageInfo)));
    }

    @GetMapping("/all") //TODO with security this won't be all but created by account and/or subscribed to
    public ResponseEntity<List<EntryDTO>> getAllKingdoms() {
        return ResponseEntity.ok().body(kingdomService.getAllKingdoms());
    }

    @GetMapping("/{name}")
    public ResponseEntity<KingdomDTO> getKingdomByName(@PathVariable("name") String name) {
        return ResponseEntity.ok().body(kingdomService.getKingdom(name));
    }

    @PostMapping
    public ResponseEntity<EntryDTO> saveKingdom(@RequestBody EntryDTO kingdom) {
        return ResponseEntity.status(HttpStatus.CREATED).body(kingdomService.saveKingdom(kingdom));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HttpStatus> updateKingdom(@PathVariable("id") Long id,
                                                    @RequestBody EntryDTO kingdom) {
        kingdomService.updateKingdom(kingdom, id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteKingdom(@PathVariable("id") Long id) {
        kingdomService.deleteKingdom(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping(path = "{kingdomId}/image",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ImageDTO> saveImageToKingdom(@PathVariable("kingdomId") Long kingdomId,
                                                       @RequestParam("image") MultipartFile imageFile) {

        return ResponseEntity.ok().body(kingdomImageService.saveImageToKingdom(imageFile, kingdomId));
    }

    @DeleteMapping("/{kingdomId}/image/{imageId}")
    public ResponseEntity<HttpStatus> deleteImageFromKingdom(@PathVariable("kingdomId") Long kingdomId,
                                                             @PathVariable("imageId") Long imageId) {
        kingdomImageService.deleteImageFromKingdom(kingdomId, imageId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping(path = "{id}/description")
    public ResponseEntity<DescriptionDTO> saveDescriptionToKingdom(@PathVariable("id") Long id,
                                                                   @RequestBody DescriptionDTO descriptionDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(kingdomDescriptionService.saveDescriptionToEntry(descriptionDTO, id));
    }

    @GetMapping(path = "{id}/description")
    public ResponseEntity<List<DescriptionDTO>> getDescriptionsOfKingdom(@PathVariable("id") Long id) {
        return ResponseEntity.ok().body(kingdomDescriptionService.getDescriptionsOfEntry(id));
    }

    @DeleteMapping(path = "/{kingdomId}/description/{descriptionId}")
    public ResponseEntity<HttpStatus> deleteDescriptionFromKingdom(@PathVariable("kingdomId") Long kingdomId,
                                                                   @PathVariable("descriptionId") Long imageId) {
        kingdomDescriptionService.deleteDescriptionFromEntry(kingdomId, imageId);
        return ResponseEntity.noContent().build();
    }
}