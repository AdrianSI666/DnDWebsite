package com.as.dndwebsite.race.subrace;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ISubRaceService {
    Page<EntryDTO> getSubRaces(PageInfo page);

    List<EntryDTO> getAllSubRaces();

    EntryDTO getSubRaceByName(String name);

    EntryDTO saveSubRace(EntryDTO entryDTO);

    void updateSubRace(EntryDTO entryDTO, Long id);

    void deleteSubRace(Long id);
}
