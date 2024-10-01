package com.as.dndwebsite.world.worldcounty;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

public interface IWorldCountyService {
    List<EntryDTO> getCountiesRelatedToWorld(Long worldId);

    Page<EntryDTO> getCountiesRelatedToWorld(String name, PageInfo pageInfo);

    EntryDTO getWorldOfCounty(String name);

    Optional<EntryDTO> getWorldOfCounty(Long id);

    EntryDTO addNewCountyWorldRelation(Long worldId, EntryDTO county);

    void setWorldToCountyRelation(Long worldId, Long countyId);

    EntryDTO addNewWorldCountyRelation(Long countyId, EntryDTO world);
}
