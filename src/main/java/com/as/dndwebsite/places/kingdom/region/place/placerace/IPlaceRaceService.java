package com.as.dndwebsite.places.kingdom.region.place.placerace;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IPlaceRaceService {
    Page<EntryDTO> getRacesRelatedToPlace(String name, PageInfo page);

    List<EntryDTO> getRacesRelatedToPlace(Long id);

    void addRaceToPlace(Long raceId, Long placeId);

    void removeRaceFromPlace(Long raceId, Long placeId);

    void addNewRaceToPlace(EntryDTO race, Long placeId);
}
