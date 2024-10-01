package com.as.dndwebsite.geographic.plane.continent.region.regionplace;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

public interface IRegionPlaceService {
    Page<EntryDTO> getPlacesRelatedToRegion(String name, PageInfo page);

    List<EntryDTO> getPlacesRelatedToRegion(Long id);

    void addPlaceRegionRelation(Long regionId, Long placeId);

    EntryDTO addNewPlaceToRegionRelation(EntryDTO place, Long regionId);

    void removePlaceRegionRelation(Long regionId, Long placeId);

    EntryDTO getRegionRelatedToPlace(String name);

    EntryDTO addNewRegionToPlaceRelation(EntryDTO region, Long placeId);

    Optional<EntryDTO> getRegionRelatedToPlace(Long id);

    List<EntryDTO> getAllPlacesWithoutRegion();
}
