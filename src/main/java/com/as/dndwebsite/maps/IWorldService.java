package com.as.dndwebsite.maps;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IWorldService {
    Page<EntryDTO> getWorlds(PageInfo page);

    EntryDTO getWorld(String name);

    EntryDTO saveWorld(EntryDTO world);

    void updateWorld(EntryDTO world, Long id);

    void deleteWorld(Long id);

    List<EntryDTO> getAllWorlds();
}
