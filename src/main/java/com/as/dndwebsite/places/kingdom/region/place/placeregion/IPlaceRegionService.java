package com.as.dndwebsite.places.kingdom.region.place.placeregion;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import org.springframework.data.domain.Page;

public interface IPlaceRegionService {
    Page<EntryDTO> getPlacesRelatedToRegion(String name, PageInfo page);

    EntryDTO getRegionOfPlace(Long id);

    void setPlaceOfRegion(Long regionId, Long placeId);

    void removePlaceOfRegion(Long regionId, Long placeId);

    void addNewRegionToPlace(EntryDTO region, Long placeId);
}
