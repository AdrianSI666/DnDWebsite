package com.as.dndwebsite.mappers;

import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.dto.EntryDTOnWorldData;
import org.springframework.stereotype.Component;

@Component
public class EntryDTOwWorldDataMapper{
    public EntryDTOnWorldData map(Entry source) {
        String worldName = "";
        String authorName = "";
        if(source.getWorld() != null){
            worldName = source.getWorld().getName();
            authorName = source.getWorld().getAuthor().getName();
        }
        return new EntryDTOnWorldData(source.getId(),
                source.getName(),
                source.getShortDescription(),
                worldName,
                authorName
        );
    }
}
