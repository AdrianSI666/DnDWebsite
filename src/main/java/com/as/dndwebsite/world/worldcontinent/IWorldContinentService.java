package com.as.dndwebsite.world.worldcontinent;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

public interface IWorldContinentService {
    List<EntryDTO> getContinentsRelatedToWorld(Long worldId);

    Page<EntryDTO> getContinentsRelatedToWorld(String name, PageInfo page);

    EntryDTO getWorldOfContinent(String name);

    Optional<EntryDTO> getWorldOfContinent(Long id);

    EntryDTO addNewContinentWorldRelation(Long worldId, EntryDTO continent);

    EntryDTO addNewWorldContinentRelation(Long continentId, EntryDTO world);

    void setWorldToContinentRelation(Long worldId, Long continentId);
}
