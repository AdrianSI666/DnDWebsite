package com.as.dndwebsite.maps.kingdom.region.regionrace;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IRegionRaceService {
    Page<EntryDTO> getRacesRelatedToRegion(String name, PageInfo page);

    List<EntryDTO> getRacesRelatedToRegion(Long id);

    void addRaceToRegion(Long raceId, Long regionId);

    void removeRaceFromRegion(Long raceId, Long regionId);

    void addNewRaceToRegion(EntryDTO race, Long regionId);

    List<EntryDTO> getRegionsRelatedToRace(Long id);

    Page<EntryDTO> getRegionsRelatedToRace(String name, PageInfo page);

    void addNewRegionToRace(EntryDTO region, Long raceId);
}
