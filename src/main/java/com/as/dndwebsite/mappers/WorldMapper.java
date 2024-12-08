package com.as.dndwebsite.mappers;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.world.World;
import org.springframework.stereotype.Component;

@Component
public class WorldMapper implements DomainMapper<World, EntryDTO> {
    @Override
    public EntryDTO map(World source) {
        return new EntryDTO(source.getId(),
                source.getName(),
                source.getShortDescription());
    }
}
