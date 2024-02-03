package com.as.dndwebsite.places.kingdom;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import org.springframework.data.domain.Page;

public interface IKingdomService {
    Page<EntryDTO> getKingdoms(PageInfo page);

    EntryDTO getKingdom(String name);

    EntryDTO saveKingdom(EntryDTO kingdom);

    void updateKingdom(EntryDTO kingdom, Long kingdomId);

    void deleteKingdom(Long id);
}
