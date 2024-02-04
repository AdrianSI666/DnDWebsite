package com.as.dndwebsite.race.racesubrace;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IRaceSubRaceService {
    Page<EntryDTO> getSubRacesOfRace(String name, PageInfo page);

    List<EntryDTO> getSubRacesOfRace(Long id);

    EntryDTO getRaceOfSubRace(long id);

    void addNewSubRaceRaceRelation(Long raceId, EntryDTO subRace);

    void addNewRaceSubRaceRelation(Long subRaceId, EntryDTO race);

    void addSubRaceRaceRelation(Long raceId, Long subRaceId);

    void removeSubRaceRaceRelation(Long raceId, Long subRaceId);

    EntryDTO getRaceOfSubRace(String name);
}
