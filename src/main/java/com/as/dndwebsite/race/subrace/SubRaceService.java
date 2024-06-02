package com.as.dndwebsite.race.subrace;

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

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class SubRaceService implements ISubRaceService {
    private final SubRaceRepository subraceRepository;
    public static final String SUB_RACE_NOT_FOUND_MSG =
            "SubRace with name %s not found";
    private final DomainMapper<Entry, EntryDTO> mapper;

    @Override
    public Page<EntryDTO> getSubRaces(PageInfo page) {
        log.info("Getting SubRaces");
        Pageable paging = PageRequest.of(page.number() - 1, page.size(), Sort.by(Sort.Direction.DESC, "id"));
        Page<SubRace> subRacePage = subraceRepository.findAll(paging);
        return subRacePage.map(mapper::map);
    }

    @Override
    public List<EntryDTO> getAllSubRaces() {
        return subraceRepository.findAll().stream().map(mapper::map).toList();
    }

    @Override
    public EntryDTO getSubRaceByName(String name) {
        log.info("Getting SubRace with name: " + name);
        return subraceRepository.findByName(name).orElseThrow(
                () -> new NotFoundException(String.format(SUB_RACE_NOT_FOUND_MSG, name)));
    }

    @Override
    public EntryDTO saveSubRace(EntryDTO entryDTO) {
        log.info("Saving new SubRace {}", entryDTO.name());
        SubRace subRace = new SubRace(entryDTO.name(), entryDTO.shortDescription());
        subRace.setImages(new ArrayList<>());
        return mapper.map(subraceRepository.save(subRace));
    }

    @Override
    public void updateSubRace(EntryDTO entryDTO, Long id) {
        log.info("Updating SubRace {} with id {}", entryDTO.name(), id);
        SubRace oldSubrace = subraceRepository.findById(id).orElseThrow(
                () -> new NotFoundException(String.format(SUB_RACE_NOT_FOUND_MSG, id)));
        oldSubrace.setName(entryDTO.name());
        oldSubrace.setShortDescription(entryDTO.shortDescription());
    }

    @Override
    public void deleteSubRace(Long id) {
        log.info("Deleting SubRace with id {}", id);
        subraceRepository.deleteById(id);
    }
}
