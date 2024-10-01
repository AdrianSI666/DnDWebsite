package com.as.dndwebsite.creatures.types;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ICreatureTypeService {
    Page<EntryDTO> getCreatureTypes(PageInfo page);

    CreatureTypeDTO getCreatureType(String name);

    EntryDTO saveCreatureType(EntryDTO creatureType);

    void updateCreatureType(EntryDTO creatureType, Long id);

    void deleteCreatureType(long id);

    List<EntryDTO> getAllCreatureTypes();
}
