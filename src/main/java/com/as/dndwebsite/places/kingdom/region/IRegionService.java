package com.as.dndwebsite.places.kingdom.region;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import org.springframework.data.domain.Page;

public interface IRegionService {
    Page<EntryDTO> getRegions(PageInfo page);

    EntryDTO getRegion(String name);

    EntryDTO saveRegion(EntryDTO region);

    void updateRegion(EntryDTO region, Long id);

    void deleteRegion(Long id);
}
