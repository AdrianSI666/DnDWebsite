package com.as.dndwebsite.maps.plane.planecontinent;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IPlaneContinentService {
    List<EntryDTO> getContinentsRelatedToPlane(Long planeId);

    EntryDTO getPlaneOfContinent(String name);

    EntryDTO getPlaneOfContinent(Long id);

    void addNewContinentPlaneRelation(Long planeId, EntryDTO continent);

    void removeContinentPlaneRelation(Long planeId, Long continentId);

    void addContinentPlaneRelation(Long planeId, Long continentId);

    Page<EntryDTO> getContinentsRelatedToPlane(String name, PageInfo pageInfo);

    void addNewPlaneContinentRelation(Long continentId, EntryDTO plane);
}
