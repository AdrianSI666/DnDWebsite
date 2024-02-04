package com.as.dndwebsite.race.racesubrace;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import com.as.dndwebsite.exception.NotFoundException;
import com.as.dndwebsite.race.Race;
import com.as.dndwebsite.race.RaceRepository;
import com.as.dndwebsite.race.subrace.SubRace;
import com.as.dndwebsite.race.subrace.SubRaceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.as.dndwebsite.race.RaceService.RACE_NOT_FOUND_MSG;
import static com.as.dndwebsite.race.subrace.SubRaceService.SUB_RACE_NOT_FOUND_MSG;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class RaceSubRaceService implements IRaceSubRaceService {
    private final RaceRepository raceRepository;
    private final SubRaceRepository subraceRepository;
    @Override
    public Page<EntryDTO> getSubRacesOfRace(String name, PageInfo page) {
        Pageable paging = PageRequest.of(page.number() - 1, page.size(), Sort.by(Sort.Direction.DESC, "id"));
        return subraceRepository.findAllByRaceName(name, paging);
    }

    @Override
    public List<EntryDTO> getSubRacesOfRace(Long id) {
        return subraceRepository.findAllByRaceId(id);
    }

    @Override
    public EntryDTO getRaceOfSubRace(long id) {
        return raceRepository.findBySubRaces_Id(id).orElseThrow(() -> new NotFoundException(String.format(RACE_NOT_FOUND_MSG, id)));
    }

    @Override
    public EntryDTO getRaceOfSubRace(String name) {
        return raceRepository.findBySubRaces_Name(name).orElseThrow(() -> new NotFoundException(String.format(RACE_NOT_FOUND_MSG, name)));
    }

    @Override
    public void addNewSubRaceRaceRelation(Long raceId, EntryDTO subRace) {
        log.info("Adding subRace {} to race {}", subRace.name(), raceId);
        Race race = raceRepository.findById(raceId).orElseThrow(() -> new NotFoundException(String.format(RACE_NOT_FOUND_MSG, raceId)));
        SubRace subrace = subraceRepository.save(new SubRace(subRace.name(), subRace.description(), race));
        race.getSubRaces().add(subrace);
    }

    @Override
    public void addNewRaceSubRaceRelation(Long subRaceId, EntryDTO race) {
        SubRace subRace = subraceRepository.findById(subRaceId).orElseThrow(() -> new NotFoundException(String.format(SUB_RACE_NOT_FOUND_MSG, subRaceId)));
        Race newRace = raceRepository.save(new Race(race.name(), race.description(), subRace));
        subRace.setRace(newRace);
    }

    @Override
    public void addSubRaceRaceRelation(Long raceId, Long subRaceId) {
        log.info("Adding subRace {} to race {}", subRaceId, raceId);
        Race race = raceRepository.findById(raceId).orElseThrow(() -> new NotFoundException(String.format(RACE_NOT_FOUND_MSG, raceId)));
        SubRace subrace = subraceRepository.findById(subRaceId).orElseThrow(() -> new NotFoundException(String.format(SUB_RACE_NOT_FOUND_MSG, subRaceId)));
        subrace.setRace(race);
        race.getSubRaces().add(subrace);
    }

    @Override
    public void removeSubRaceRaceRelation(Long raceId, Long subRaceId) {
        log.info("Deleting subRace {} from race {}", subRaceId, raceId);
        Race race = raceRepository.findById(raceId).orElseThrow(() -> new NotFoundException(String.format(RACE_NOT_FOUND_MSG, raceId)));
        SubRace subrace = subraceRepository.findById(subRaceId).orElseThrow(() -> new NotFoundException(String.format(SUB_RACE_NOT_FOUND_MSG, subRaceId)));
        race.getSubRaces().remove(subrace);
        subrace.setRace(null);
    }


}
