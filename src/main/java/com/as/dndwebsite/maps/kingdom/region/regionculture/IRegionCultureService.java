package com.as.dndwebsite.maps.kingdom.region.regionculture;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IRegionCultureService {
    Page<EntryDTO> getCulturesRelatedToRegion(String name, PageInfo page);

    List<EntryDTO> getCulturesRelatedToRegion(Long regionId);

    void addCultureRegionRelation(Long cultureId, Long regionId);

    EntryDTO addNewCultureToRegionRelation(EntryDTO culture, Long regionId);

    void removeCultureRegionRelation(Long cultureId, Long regionId);

    List<EntryDTO> getRegionsRelatedToCulture(Long regionId);

    Page<EntryDTO> getRegionsRelatedToCulture(String name, PageInfo pageInfo);

    EntryDTO addNewRegionToCultureRelation(EntryDTO region, Long cultureId);
}
