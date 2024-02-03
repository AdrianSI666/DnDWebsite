package com.as.dndwebsite.places.kingdom.kingdomcontinent;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import org.springframework.data.domain.Page;

public interface IKingdomContinentService {
    Page<EntryDTO> getKingdomsRelatedToContinent(String name, PageInfo page);

    EntryDTO getContinentOfKingdom(long id);

    void setContinent(Long kingdomId, Long continentId);

    void removeContinent(Long kingdomId, Long continentId);

    void addNewContinent(Long kingdomId, EntryDTO continent);
}
