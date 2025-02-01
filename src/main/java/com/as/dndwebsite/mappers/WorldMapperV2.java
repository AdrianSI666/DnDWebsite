package com.as.dndwebsite.mappers;

import com.as.dndwebsite.world.World;
import com.as.dndwebsite.world.WorldNAuthorDTO;
import org.springframework.stereotype.Component;

@Component
public class WorldMapperV2 {
    public WorldNAuthorDTO map(World source) {
        return new WorldNAuthorDTO(source.getId(),
                source.getName(),
                source.getShortDescription(),
                source.getAuthor().getId(),
                source.getAuthor().getName()
        );
    }
}
