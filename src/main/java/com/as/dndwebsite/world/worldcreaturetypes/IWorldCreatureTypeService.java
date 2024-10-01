package com.as.dndwebsite.world.worldcreaturetypes;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

public interface IWorldCreatureTypeService {
    List<EntryDTO> getCreatureTypesRelatedToWorld(Long worldId);

    Page<EntryDTO> getCreatureTypesRelatedToWorld(String name, PageInfo pageInfo);

    EntryDTO getWorldOfCreatureType(String name);

    Optional<EntryDTO> getWorldOfCreatureType(Long id);

    EntryDTO addNewCreatureTypeWorldRelation(Long worldId, EntryDTO creatureType);

    void setWorldToCreatureTypeRelation(Long worldId, Long creatureTypeId);

    EntryDTO addNewWorldCreatureTypeRelation(Long creatureTypeId, EntryDTO world);
}
