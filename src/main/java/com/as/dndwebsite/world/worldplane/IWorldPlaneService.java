package com.as.dndwebsite.world.worldplane;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

public interface IWorldPlaneService {
    List<EntryDTO> getPlanesRelatedToWorld(Long worldId);

    Page<EntryDTO> getPlanesRelatedToWorld(String name, PageInfo pageInfo);

    EntryDTO getWorldOfPlane(String name);

    Optional<EntryDTO> getWorldOfPlane(Long id);

    EntryDTO addNewPlaneWorldRelation(Long worldId, EntryDTO plane);

    void setWorldToPlaneRelation(Long worldId, Long planeId);

    EntryDTO addNewWorldPlaneRelation(Long planeId, EntryDTO world);
}
