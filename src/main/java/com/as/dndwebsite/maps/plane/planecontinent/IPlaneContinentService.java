package com.as.dndwebsite.maps.plane.planecontinent;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

public interface IPlaneContinentService {
    List<EntryDTO> getContinentsRelatedToPlane(Long planeId);

    EntryDTO getPlaneOfContinent(String name);

    Optional<EntryDTO> getPlaneOfContinent(Long id);

    EntryDTO addNewContinentPlaneRelation(Long planeId, EntryDTO continent);

    void removeContinentPlaneRelation(Long planeId, Long continentId);

    void addContinentPlaneRelation(Long planeId, Long continentId);

    Page<EntryDTO> getContinentsRelatedToPlane(String name, PageInfo pageInfo);

    EntryDTO addNewPlaneContinentRelation(Long continentId, EntryDTO plane);

    List<EntryDTO> getAllContinentsWithoutPlane();
}
