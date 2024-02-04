package com.as.dndwebsite.maps.kingdom.kingdomregion;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IKingdomRegionService {
    void addNewRegionKingdomRelation(Long kingdomId, EntryDTO region);

    void removeRegionKingdomRelation(Long kingdomId, Long regionId);

    List<EntryDTO> getRegionsRelatedToKingdom(Long kingdomId);

    Page<EntryDTO> getRegionsRelatedToKingdom(String name, PageInfo pageInfo);

    void addNewKingdomRegionRelation(EntryDTO kingdom, Long regionId);

    void addRegionKingdomRelation(Long kingdomId, Long regionId);

    EntryDTO getKingdomRelatedToRegion(String name);

    EntryDTO getKingdomOfRegion(Long id);
}
