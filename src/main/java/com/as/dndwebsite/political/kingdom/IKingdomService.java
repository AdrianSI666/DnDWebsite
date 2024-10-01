package com.as.dndwebsite.political.kingdom;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IKingdomService {
    Page<EntryDTO> getKingdoms(PageInfo page);

    KingdomDTO getKingdom(String name);

    EntryDTO saveKingdom(EntryDTO kingdom);

    void updateKingdom(EntryDTO kingdom, Long kingdomId);

    void deleteKingdom(Long id);

    List<EntryDTO> getAllKingdoms();
}
