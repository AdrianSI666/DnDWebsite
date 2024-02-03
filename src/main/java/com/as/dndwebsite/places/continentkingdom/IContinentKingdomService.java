package com.as.dndwebsite.places.continentkingdom;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IContinentKingdomService {
    List<EntryDTO> getKingdomsRelatedToContinent(Long continentId);

    void addNewKingdom(Long continentId, EntryDTO kingdom);

    void removeKingdom(Long continentId, Long kingdomId);

    void addKingdom(Long continentId, Long kingdomId);

    Page<EntryDTO> getKingdomsRelatedToContinent(String name, PageInfo pageInfo);
}
