package com.as.dndwebsite.political.kingdom.county;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.EntryFullDTO;
import com.as.dndwebsite.dto.PageInfo;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ICountyService {
    Page<EntryDTO> getCounties(PageInfo page);

    EntryFullDTO getCounty(String name);

    EntryDTO saveCounty(EntryDTO county);

    void updateCounty(EntryDTO county, Long countyId);

    void deleteCounty(Long id);

    List<EntryDTO> getAllCounties();
}
