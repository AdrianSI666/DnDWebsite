package com.as.dndwebsite.geographic.plane.planecreaturetype;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IPlaneCreatureTypeService {
    Page<EntryDTO> getCreatureTypesRelatedToPlane(String name, PageInfo page);

    List<EntryDTO> getCreatureTypesRelatedToPlane(Long planeId);

    void addCreatureTypePlaneRelation(Long creatureTypeId, Long planeId);

    EntryDTO addNewCreatureTypeToPlaneRelation(EntryDTO creatureType, Long planeId);

    void removeCreatureTypePlaneRelation(Long creatureTypeId, Long planeId);

    List<EntryDTO> getPlanesRelatedToCreatureType(Long planeId);

    Page<EntryDTO> getPlanesRelatedToCreatureType(String name, PageInfo pageInfo);

    EntryDTO addNewPlaneToCreatureTypeRelation(EntryDTO plane, Long creatureTypeId);
}
