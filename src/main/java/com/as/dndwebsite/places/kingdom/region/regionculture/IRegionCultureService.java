package com.as.dndwebsite.places.kingdom.region.regionculture;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IRegionCultureService {
    Page<EntryDTO> getCulturesRelatedToRegion(String name, PageInfo page);

    List<EntryDTO> getCulturesRelatedToRegion(Long regionId);

    void addCultureToRegion(Long cultureId, Long regionId);

    void addNewCultureToRegion(EntryDTO culture, Long regionId);

    void removeCultureFromRegion(Long cultureId, Long regionId);
}
