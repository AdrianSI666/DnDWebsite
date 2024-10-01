package com.as.dndwebsite.world.worldculture;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

public interface IWorldCultureService {
    List<EntryDTO> getCulturesRelatedToWorld(Long worldId);

    Page<EntryDTO> getCulturesRelatedToWorld(String name, PageInfo page);

    EntryDTO getWorldOfCulture(String name);

    Optional<EntryDTO> getWorldOfCulture(Long id);

    EntryDTO addNewCultureWorldRelation(Long worldId, EntryDTO culture);

    EntryDTO addNewWorldCultureRelation(Long cultureId, EntryDTO world);

    void setWorldToCultureRelation(Long worldId, Long cultureId);
}
