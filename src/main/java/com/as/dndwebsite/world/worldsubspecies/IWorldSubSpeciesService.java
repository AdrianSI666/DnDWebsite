package com.as.dndwebsite.world.worldsubspecies;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

public interface IWorldSubSpeciesService {
    List<EntryDTO> getSubSpeciesRelatedToWorld(Long worldId);

    Page<EntryDTO> getSubSpeciesRelatedToWorld(String name, PageInfo pageInfo);

    EntryDTO getWorldOfSubSpecies(String name);

    Optional<EntryDTO> getWorldOfSubSpecies(Long id);

    EntryDTO addNewSubSpeciesWorldRelation(Long worldId, EntryDTO subSpecies);

    void setWorldToSubSpeciesRelation(Long worldId, Long subSpeciesId);

    EntryDTO addNewWorldSubSpeciesRelation(Long subSpeciesId, EntryDTO world);
}
