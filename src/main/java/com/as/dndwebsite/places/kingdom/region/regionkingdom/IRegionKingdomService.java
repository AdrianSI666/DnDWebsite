package com.as.dndwebsite.places.kingdom.region.regionkingdom;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import org.springframework.data.domain.Page;

public interface IRegionKingdomService {
    Page<EntryDTO> getRegionsRelatedToKingdom(String name, PageInfo page);

    EntryDTO getKingdomOfRegion(Long id);

    void setKingdomToRegion(Long kingdomId, Long regionId);

    void removeKingdomFromRegion(Long kingdomId, Long regionId);

    void addNewKingdomToRegion(EntryDTO kingdom, Long regionId);
}
