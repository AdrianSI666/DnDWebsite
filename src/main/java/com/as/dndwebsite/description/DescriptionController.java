package com.as.dndwebsite.description;

import com.as.dndwebsite.dto.DescriptionDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/descriptions")
@RequiredArgsConstructor
public class DescriptionController {
    private final IDescriptionService descriptionService;

    @PutMapping(path = "{id}")
    public ResponseEntity<DescriptionDTO> updateDescription(@PathVariable("id") Long id,
                                                            @RequestBody DescriptionDTO descriptionDTO) {
        return ResponseEntity.ok().body(descriptionService.updateDescription(descriptionDTO, id));
    }
}
