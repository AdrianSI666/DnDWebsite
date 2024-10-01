package com.as.dndwebsite.geographic.plane.continent.region;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IRegionService {
    Page<EntryDTO> getRegions(PageInfo page);

    RegionDTO getRegion(String name);

    EntryDTO saveRegion(EntryDTO region);

    void updateRegion(EntryDTO region, Long id);

    void deleteRegion(Long id);

    List<EntryDTO> getAllRegions();
}
