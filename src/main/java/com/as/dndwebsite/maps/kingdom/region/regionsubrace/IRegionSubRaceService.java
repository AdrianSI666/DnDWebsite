package com.as.dndwebsite.maps.kingdom.region.regionsubrace;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IRegionSubRaceService {
    Page<EntryDTO> getSubRacesRelatedToRegion(String name, PageInfo page);

    List<EntryDTO> getSubRacesRelatedToRegion(Long id);

    void addSubRaceRegionRelation(Long subRaceId, Long regionId);

    void removeSubRaceRegionRelation(Long subRaceId, Long regionId);

    void addNewSubRaceToRegion(EntryDTO subRace, Long regionId);

    void addNewRegionSubRaceRelation(EntryDTO region, Long subRaceId);

    List<EntryDTO> getRegionsRelatedToSubRace(Long id);

    Page<EntryDTO> getRegionsRelatedToSubRace(String name, PageInfo pageInfo);
}
