package com.as.dndwebsite.race;

import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import com.as.dndwebsite.exception.NotFoundException;
import com.as.dndwebsite.race.subrace.SubRace;
import com.as.dndwebsite.race.subrace.SubRaceRepository;
import com.as.dndwebsite.util.DomainMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.as.dndwebsite.race.subrace.SubRaceService.SUB_RACE_NOT_FOUND_MSG;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class RaceService {
    private final RaceRepository raceRepository;
    private final SubRaceRepository subraceRepository;
    public static final String RACE_NOT_FOUND_MSG = "race with name %s not found";
    private final DomainMapper<Entry, EntryDTO> mapper;

    public Page<EntryDTO> getRaces(PageInfo page) {
        log.info("Getting races");
        Pageable paging = PageRequest.of(page.number() - 1, page.size(), Sort.by(Sort.Direction.DESC, "id"));
        Page<Race> documentPage = raceRepository.findAll(paging);
        return documentPage.map(mapper::map);
    }

    public EntryDTO getRace(String name) {
        log.info("Getting race");
        return raceRepository.findByName(name).orElseThrow(
                () -> new NotFoundException(String.format(RACE_NOT_FOUND_MSG, name)));
    }

    public EntryDTO saveRace(EntryDTO race) {
        log.info("Saving new race {}", race.name());
        Race savedRace = raceRepository.save(new Race(race.name(), race.description()));
        return mapper.map(savedRace);
    }

    public void updateRace(EntryDTO race, Long id) {
        log.info("Updating Race {} with id {}", race.name(), id);
        Race oldRace = raceRepository.findById(id).orElseThrow(
                () -> new NotFoundException(String.format(RACE_NOT_FOUND_MSG, id)));
        oldRace.setName(race.name());
        oldRace.setDescription(race.description());
    }

    public void deleteRace(long id) {
        Race race = raceRepository.findById(id).orElseThrow(
                () -> new NotFoundException(String.format(RACE_NOT_FOUND_MSG, id)));
        log.info("Deleting Race with id {}", id);
        subraceRepository.deleteAllByRaceId(id);
        raceRepository.delete(race);
    }

    public List<EntryDTO> getSubRacesOfRace(long id) {
        return subraceRepository.findAllByRaceId(id);
    }

    public void addSubRace(Long raceId, EntryDTO subRace) {
        log.info("Adding subRace {} to race {}", subRace.name(), raceId);
        Race race = raceRepository.findById(raceId).orElseThrow(() -> new NotFoundException(String.format(RACE_NOT_FOUND_MSG, raceId)));
        SubRace subrace = new SubRace(subRace.name(), subRace.description());
        subraceRepository.save(subrace);
        subrace.setRace(race);
        race.getSubRaces().add(subrace);
    }

    public void deleteSubRaceFromRace(Long raceId, Long subRaceId) {
        log.info("Deleting subRace {} from race {}", subRaceId, raceId);
        Race race = raceRepository.findById(raceId).orElseThrow(() -> new NotFoundException(String.format(RACE_NOT_FOUND_MSG, raceId)));
        SubRace subrace = subraceRepository.findById(subRaceId).orElseThrow(() -> new NotFoundException(String.format(SUB_RACE_NOT_FOUND_MSG, subRaceId)));
        race.getSubRaces().remove(subrace);
        subrace.setRace(null);
    }
}
