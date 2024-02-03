package com.as.dndwebsite.race.subrace;

import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import com.as.dndwebsite.exception.NotFoundException;
import com.as.dndwebsite.race.Race;
import com.as.dndwebsite.race.RaceRepository;
import com.as.dndwebsite.util.DomainMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

import static com.as.dndwebsite.race.RaceService.RACE_NOT_FOUND_MSG;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class SubRaceService {
    private final SubRaceRepository subraceRepository;
    private final RaceRepository raceRepository;
    public static final String SUB_RACE_NOT_FOUND_MSG =
            "SubRace with name %s not found";
    private final DomainMapper<Entry, EntryDTO> mapper;

    public Page<EntryDTO> getSubRaces(PageInfo page) {
        log.info("Getting SubRaces");
        Pageable paging = PageRequest.of(page.number() - 1, page.size(), Sort.by(Sort.Direction.DESC, "id"));
        Page<SubRace> subRacePage = subraceRepository.findAll(paging);
        return subRacePage.map(mapper::map);
    }

    public EntryDTO getSubRaceByName(String name) {
        log.info("Getting SubRace with name: " + name);
        return subraceRepository.findByName(name).orElseThrow(
                () -> new NotFoundException(String.format(SUB_RACE_NOT_FOUND_MSG, name)));
    }

    public EntryDTO saveSubRace(EntryDTO entryDTO) {
        log.info("Saving new SubRace {}", entryDTO.name());
        SubRace subRace = new SubRace(entryDTO.name(), entryDTO.description());
        subRace.setImages(new ArrayList<>());
        return mapper.map(subraceRepository.save(subRace));
    }

    public void updateSubRace(EntryDTO entryDTO, Long id) {
        log.info("Updating SubRace {} with id {}", entryDTO.name(), id);
        SubRace oldSubrace = subraceRepository.findById(id).orElseThrow(
                () -> new NotFoundException(String.format(SUB_RACE_NOT_FOUND_MSG, id)));
        oldSubrace.setName(entryDTO.name());
        oldSubrace.setDescription(entryDTO.description());
    }

    public void deleteSubRace(Long id) {
        log.info("Deleting SubRace with id {}", id);
        subraceRepository.deleteById(id);
    }

    public List<EntryDTO> getSubRacesInRelationToRace(String name) {
        return subraceRepository.findAllByRaceName(name);
    }

    public void setRaceToSubRace(Long subRaceId, Long raceId) {
        log.info("Setting race {} to subRace {}", raceId, subRaceId);
        SubRace subRace = subraceRepository.findById(subRaceId).orElseThrow(() -> new NotFoundException(String.format(SUB_RACE_NOT_FOUND_MSG, subRaceId)));
        Race race = raceRepository.findById(raceId).orElseThrow(() -> new NotFoundException(String.format(RACE_NOT_FOUND_MSG, raceId)));
        subRace.setRace(race);
        race.getSubRaces().add(subRace);
    }
}
