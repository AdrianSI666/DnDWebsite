package com.as.dndwebsite.mappers;

import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.dto.EntryDTO;
import org.springframework.stereotype.Component;

@Component
public class EntryMapper implements DomainMapper<Entry, EntryDTO> {

    @Override
    public EntryDTO map(Entry source) {
        return new EntryDTO(source.getId(), source.getName(), source.getShortDescription());
    }
}
