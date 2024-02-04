package com.as.dndwebsite.race;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IRaceService {
    Page<EntryDTO> getRaces(PageInfo page);

    EntryDTO getRace(String name);

    EntryDTO saveRace(EntryDTO race);

    void updateRace(EntryDTO race, Long id);

    void deleteRace(long id);

    List<EntryDTO> getAllRaces();
}
