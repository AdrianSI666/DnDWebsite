package com.as.dndwebsite.mappers;

import com.as.dndwebsite.description.Description;
import com.as.dndwebsite.dto.DescriptionDTO;
import org.springframework.stereotype.Component;

@Component
public class DescriptionMapper implements DomainMapper<Description, DescriptionDTO> {
    @Override
    public DescriptionDTO map(Description source) {
        return new DescriptionDTO(source.getId(), source.getTitle(), source.getText());
    }
}
