package com.as.dndwebsite.maps.continentkingdom;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IContinentKingdomService {
    List<EntryDTO> getKingdomsRelatedToContinent(Long continentId);

    EntryDTO getContinentOfKingdom(String name);

    EntryDTO getContinentOfKingdom(Long id);

    void addNewKingdomContinentRelation(Long continentId, EntryDTO kingdom);

    void removeKingdomContinentRelation(Long continentId, Long kingdomId);

    void addKingdomContinentRelation(Long continentId, Long kingdomId);

    Page<EntryDTO> getKingdomsRelatedToContinent(String name, PageInfo pageInfo);

    void addNewContinentKingdomRelation(Long kingdomId, EntryDTO continent);
}
