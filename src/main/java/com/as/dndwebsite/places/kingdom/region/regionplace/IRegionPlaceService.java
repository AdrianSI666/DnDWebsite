package com.as.dndwebsite.places.kingdom.region.regionplace;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IRegionPlaceService {
    Page<EntryDTO> getPlacesRelatedToRegion(String name, PageInfo page);

    List<EntryDTO> getPlacesRelatedToRegion(Long id);

    void addPlace(Long regionId, Long placeId);

    void addNewPlaceToRegion(EntryDTO place, Long regionId);

    void removePlace(Long regionId, Long placeId);
}
