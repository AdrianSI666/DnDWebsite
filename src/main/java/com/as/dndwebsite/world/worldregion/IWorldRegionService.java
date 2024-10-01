package com.as.dndwebsite.world.worldregion;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

public interface IWorldRegionService {
    List<EntryDTO> getRegionsRelatedToWorld(Long worldId);

    Page<EntryDTO> getRegionsRelatedToWorld(String name, PageInfo pageInfo);

    EntryDTO getWorldOfRegion(String name);

    Optional<EntryDTO> getWorldOfRegion(Long id);

    EntryDTO addNewRegionWorldRelation(Long worldId, EntryDTO region);

    void setWorldToRegionRelation(Long worldId, Long regionId);

    EntryDTO addNewWorldRegionRelation(Long regionId, EntryDTO world);
}
