package com.as.dndwebsite.political.kingdom.continentkingdom;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

public interface IContinentKingdomService {
    List<EntryDTO> getKingdomsRelatedToContinent(Long continentId);

    EntryDTO getContinentOfKingdom(String name);

    Optional<EntryDTO> getContinentOfKingdom(Long id);

    EntryDTO addNewKingdomContinentRelation(Long continentId, EntryDTO kingdom);

    void removeKingdomContinentRelation(Long continentId, Long kingdomId);

    void addKingdomContinentRelation(Long continentId, Long kingdomId);

    Page<EntryDTO> getKingdomsRelatedToContinent(String name, PageInfo pageInfo);

    EntryDTO addNewContinentKingdomRelation(Long kingdomId, EntryDTO continent);

    List<EntryDTO> getAllKingdomsWithoutContinent();
}
