package com.as.dndwebsite.political.kingdom.county.countyregion;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ICountyRegionService {
    EntryDTO addNewRegionCountyRelation(Long countyId, EntryDTO region);

    void removeRegionCountyRelation(Long countyId, Long regionId);

    List<EntryDTO> getRegionsRelatedToCounty(Long countyId);

    Page<EntryDTO> getRegionsRelatedToCounty(String name, PageInfo pageInfo);

    EntryDTO addNewCountyRegionRelation(EntryDTO county, Long regionId);

    void addRegionCountyRelation(Long countyId, Long regionId);

    List<EntryDTO> getCountiesRelatedToRegion(String name);

    List<EntryDTO> getCountiesOfRegion(Long id);

    List<EntryDTO> getAllRegionsWithoutCounty();
}
