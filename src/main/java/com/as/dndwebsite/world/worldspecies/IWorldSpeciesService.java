package com.as.dndwebsite.world.worldspecies;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

public interface IWorldSpeciesService {
    List<EntryDTO> getSpeciesRelatedToWorld(Long worldId);

    Page<EntryDTO> getSpeciesRelatedToWorld(String name, PageInfo pageInfo);

    EntryDTO getWorldOfSpecies(String name);

    Optional<EntryDTO> getWorldOfSpecies(Long id);

    EntryDTO addNewSpeciesWorldRelation(Long worldId, EntryDTO species);

    void setWorldToSpeciesRelation(Long worldId, Long speciesId);

    EntryDTO addNewWorldSpeciesRelation(Long speciesId, EntryDTO world);
}
