package com.as.dndwebsite.race;

import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import com.as.dndwebsite.exception.NotFoundException;
import com.as.dndwebsite.mappers.DomainMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class RaceService implements IRaceService {
    private final RaceRepository raceRepository;
    public static final String RACE_NOT_FOUND_MSG = "race with name %s not found";
    private final DomainMapper<Entry, EntryDTO> mapper;

    @Override
    public Page<EntryDTO> getRaces(PageInfo page) {
        log.info("Getting races");
        Pageable paging = PageRequest.of(
                page.number() - 1,
                page.size(),
                Sort.by(Sort.Direction.DESC, "id"));
        Page<Race> racePage = raceRepository.findAll(paging);
        return racePage.map(mapper::map);
    }

    @Override
    public EntryDTO getRace(String name) {
        log.info("Getting race");
        return raceRepository.findByName(name).orElseThrow(
                () -> new NotFoundException(
                        String.format(RACE_NOT_FOUND_MSG, name)));
    }

    @Override
    public EntryDTO saveRace(EntryDTO race) {
        log.info("Saving new race {}", race.name());
        Race savedRace = raceRepository.save(new Race(race.name(), race.shortDescription()));
        return mapper.map(savedRace);
    }

    @Override
    public void updateRace(EntryDTO race, Long id) {
        log.info("Updating Race {} with id {}", race.name(), id);
        Race oldRace = raceRepository.findById(id).orElseThrow(
                () -> new NotFoundException(String.format(RACE_NOT_FOUND_MSG, id)));
        oldRace.setName(race.name());
        oldRace.setShortDescription(race.shortDescription());
    }

    @Override
    public void deleteRace(long id) {
        Race race = raceRepository.findById(id).orElseThrow(
                () -> new NotFoundException(String.format(RACE_NOT_FOUND_MSG, id)));
        log.info("Deleting Race with id {}", id);
        raceRepository.delete(race);
    }


    @Override
    public List<EntryDTO> getAllRaces() {

        return raceRepository.findAll().stream().map(mapper::map).toList();
    }
}
