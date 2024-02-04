package com.as.dndwebsite.maps.kingdom.region.place;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IPlaceService {
    Page<EntryDTO> getPlaces(PageInfo page);

    EntryDTO getPlace(String name);

    EntryDTO savePlace(EntryDTO place);

    void updatePlace(EntryDTO place, Long id);

    void deletePlace(Long id);

    List<EntryDTO> getAllPlaces();
}
