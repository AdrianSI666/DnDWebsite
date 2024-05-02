package com.as.dndwebsite.maps.worldplane;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IWorldPlaneService {
    List<EntryDTO> getPlanesRelatedToWorld(Long worldId);

    Page<EntryDTO> getPlanesRelatedToWorld(String name, PageInfo pageInfo);

    EntryDTO getWorldOfPlane(String name);

    EntryDTO getWorldOfPlane(Long id);

    EntryDTO addNewPlaneWorldRelation(Long worldId, EntryDTO plane);

    void removePlaneWorldRelation(Long worldId, Long planeId);

    void addPlaneWorldRelation(Long worldId, Long planeId);

    EntryDTO addNewWorldPlaneRelation(Long planeId, EntryDTO world);

    List<EntryDTO> getAllPlanesWithoutWorld();
}
