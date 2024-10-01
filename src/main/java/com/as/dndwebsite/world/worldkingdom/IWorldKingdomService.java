package com.as.dndwebsite.world.worldkingdom;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

public interface IWorldKingdomService {
    List<EntryDTO> getKingdomsRelatedToWorld(Long worldId);

    Page<EntryDTO> getKingdomsRelatedToWorld(String name, PageInfo pageInfo);

    EntryDTO getWorldOfKingdom(String name);

    Optional<EntryDTO> getWorldOfKingdom(Long id);

    EntryDTO addNewKingdomWorldRelation(Long worldId, EntryDTO kingdom);

    void setWorldToKingdomRelation(Long worldId, Long kingdomId);

    EntryDTO addNewWorldKingdomRelation(Long kingdomId, EntryDTO world);
}
