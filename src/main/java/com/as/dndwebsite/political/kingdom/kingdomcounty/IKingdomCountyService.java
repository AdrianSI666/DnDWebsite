package com.as.dndwebsite.political.kingdom.kingdomcounty;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

public interface IKingdomCountyService {
    List<EntryDTO> getCountiesRelatedToKingdom(Long kingdomId);

    EntryDTO getKingdomOfCounty(String name);

    Optional<EntryDTO> getKingdomOfCounty(Long id);

    EntryDTO addNewCountyKingdomRelation(Long kingdomId, EntryDTO county);

    void removeCountyKingdomRelation(Long kingdomId, Long countyId);

    void addCountyKingdomRelation(Long kingdomId, Long countyId);

    Page<EntryDTO> getCountiesRelatedToKingdom(String name, PageInfo pageInfo);

    EntryDTO addNewKingdomCountyRelation(Long countyId, EntryDTO kingdom);

    List<EntryDTO> getAllCountiesWithoutKingdom();
}
