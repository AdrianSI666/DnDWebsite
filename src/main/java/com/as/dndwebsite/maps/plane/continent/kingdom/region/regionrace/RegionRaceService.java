package com.as.dndwebsite.maps.plane.continent.kingdom.region.regionrace;

import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import com.as.dndwebsite.exception.BadRequestException;
import com.as.dndwebsite.exception.NotFoundException;
import com.as.dndwebsite.maps.plane.continent.kingdom.region.Region;
import com.as.dndwebsite.maps.plane.continent.kingdom.region.RegionRepository;
import com.as.dndwebsite.maps.plane.continent.kingdom.region.RegionService;
import com.as.dndwebsite.race.Race;
import com.as.dndwebsite.race.RaceRepository;
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

import static com.as.dndwebsite.race.RaceService.RACE_NOT_FOUND_MSG;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class RegionRaceService implements IRegionRaceService {
    private final RegionRepository regionRepository;
    private final RaceRepository raceRepository;
    private final DomainMapper<Entry, EntryDTO> mapper;
    @Override
    public Page<EntryDTO> getRacesRelatedToRegion(String name, PageInfo page) {
        Pageable paging = PageRequest.of(page.number() - 1, page.size(), Sort.by(Sort.Direction.DESC, "id"));
        return raceRepository.findAllByRegions_Name(name, paging);
    }

    @Override
    public List<EntryDTO> getRacesRelatedToRegion(Long id) {
        log.info("Getting races related to Region with id {}", id);
        return raceRepository.findAllByRegions_Id(id);
    }

    @Override
    public void addRaceToRegion(Long raceId, Long regionId) {
        Race race = raceRepository.findById(raceId).orElseThrow(() -> new NotFoundException(String.format(RACE_NOT_FOUND_MSG, raceId)));
        Region region = regionRepository.findById(regionId).orElseThrow(() -> new NotFoundException(String.format(RegionService.REGION_NOT_FOUND_MSG, regionId)));
        if(!region.getRaces().add(race)) throw new BadRequestException("Region %s and Race %s are already linked".formatted(region.getName(), race.getName()));
        race.getRegions().add(region);
    }

    @Override
    public void removeRaceFromRegion(Long raceId, Long regionId) {
        Race race = raceRepository.findById(raceId).orElseThrow(() -> new NotFoundException(String.format(RACE_NOT_FOUND_MSG, raceId)));
        Region region = regionRepository.findById(regionId).orElseThrow(() -> new NotFoundException(String.format(RegionService.REGION_NOT_FOUND_MSG, regionId)));
        region.getRaces().remove(race);
        race.getRegions().remove(region);
    }

    @Override
    public EntryDTO addNewRaceToRegion(EntryDTO race, Long regionId) {
        Region region = regionRepository.findById(regionId).orElseThrow(() -> new NotFoundException(String.format(RegionService.REGION_NOT_FOUND_MSG, regionId)));
        Race newRace = raceRepository.save(new Race(race.name(), race.shortDescription(), region));
        region.getRaces().add(newRace);
        return mapper.map(newRace);
    }

    @Override
    public List<EntryDTO> getRegionsRelatedToRace(Long id) {
        return regionRepository.findAllByRaces_Id(id);
    }

    @Override
    public Page<EntryDTO> getRegionsRelatedToRace(String name, PageInfo page) {
        Pageable paging = PageRequest.of(page.number() - 1, page.size(), Sort.by(Sort.Direction.DESC, "id"));
        return raceRepository.findAllBySubRaces_Name(name, paging);
    }

    @Override
    public EntryDTO addNewRegionToRace(EntryDTO region, Long raceId) {
        Race race = raceRepository.findById(raceId).orElseThrow(() -> new NotFoundException(String.format(RegionService.REGION_NOT_FOUND_MSG, raceId)));
        Region newRegion = regionRepository.save(new Region(region.name(), region.shortDescription(), race));
        race.getRegions().add(newRegion);
        return mapper.map(newRegion);
    }
}
