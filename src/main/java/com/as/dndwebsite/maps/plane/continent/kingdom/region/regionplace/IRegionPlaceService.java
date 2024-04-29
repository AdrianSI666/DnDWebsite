package com.as.dndwebsite.maps.plane.continent.kingdom.region.regionplace;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IRegionPlaceService {
    Page<EntryDTO> getPlacesRelatedToRegion(String name, PageInfo page);

    List<EntryDTO> getPlacesRelatedToRegion(Long id);

    void addPlaceRegionRelation(Long regionId, Long placeId);

    void addNewPlaceToRegionRelation(EntryDTO place, Long regionId);

    void removePlaceRegionRelation(Long regionId, Long placeId);

    EntryDTO getRegionRelatedToPlace(String name);

    void addNewRegionToPlaceRelation(EntryDTO region, Long placeId);

    EntryDTO getRegionRelatedToPlace(Long id);
}
