package com.as.dndwebsite.places.kingdom.kingdomregion;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IKingdomRegionService {
    void addNewRegion(Long kingdomId, EntryDTO region);

    void removeRegion(Long kingdomId, Long regionId);

    List<EntryDTO> getRegionsRelatedToKingdom(Long kingdomId);

    Page<EntryDTO> getRegionsRelatedToKingdom(String name, PageInfo pageInfo);

    void addRegion(Long kingdomId, Long regionId);
}
