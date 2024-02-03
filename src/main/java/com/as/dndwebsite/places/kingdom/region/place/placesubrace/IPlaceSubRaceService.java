package com.as.dndwebsite.places.kingdom.region.place.placesubrace;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IPlaceSubRaceService {
    Page<EntryDTO> getSubRacesRelatedToPlace(String name, PageInfo page);

    List<EntryDTO> getSubRacesRelatedToPlace(Long id);

    void addSubRaceToPlace(Long subRaceId, Long placeId);

    void removeSubRaceFromPlace(Long subRaceId, Long placeId);

    void addNewSubRaceToPlace(EntryDTO subRace, Long placeId);
}
