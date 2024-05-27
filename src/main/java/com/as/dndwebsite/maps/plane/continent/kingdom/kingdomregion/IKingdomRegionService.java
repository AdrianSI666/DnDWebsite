package com.as.dndwebsite.maps.plane.continent.kingdom.kingdomregion;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

public interface IKingdomRegionService {
    EntryDTO addNewRegionKingdomRelation(Long kingdomId, EntryDTO region);

    void removeRegionKingdomRelation(Long kingdomId, Long regionId);

    List<EntryDTO> getRegionsRelatedToKingdom(Long kingdomId);

    Page<EntryDTO> getRegionsRelatedToKingdom(String name, PageInfo pageInfo);

    EntryDTO addNewKingdomRegionRelation(EntryDTO kingdom, Long regionId);

    void addRegionKingdomRelation(Long kingdomId, Long regionId);

    EntryDTO getKingdomRelatedToRegion(String name);

    Optional<EntryDTO> getKingdomOfRegion(Long id);

    List<EntryDTO> getAllRegionsWithoutKingdom();
}
