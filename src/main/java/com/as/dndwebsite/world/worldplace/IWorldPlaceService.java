package com.as.dndwebsite.world.worldplace;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

public interface IWorldPlaceService {
    List<EntryDTO> getPlacesRelatedToWorld(Long worldId);

    Page<EntryDTO> getPlacesRelatedToWorld(String name, PageInfo pageInfo);

    EntryDTO getWorldOfPlace(String name);

    Optional<EntryDTO> getWorldOfPlace(Long id);

    EntryDTO addNewPlaceWorldRelation(Long worldId, EntryDTO place);

    void setWorldToPlaceRelation(Long worldId, Long placeId);

    EntryDTO addNewWorldPlaceRelation(Long placeId, EntryDTO world);
}
