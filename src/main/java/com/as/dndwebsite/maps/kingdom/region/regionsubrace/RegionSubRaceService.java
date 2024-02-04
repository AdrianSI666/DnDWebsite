package com.as.dndwebsite.maps.kingdom.region.regionsubrace;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import com.as.dndwebsite.exception.NotFoundException;
import com.as.dndwebsite.maps.kingdom.region.Region;
import com.as.dndwebsite.maps.kingdom.region.RegionRepository;
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

import static com.as.dndwebsite.maps.kingdom.region.RegionService.REGION_NOT_FOUND_MSG;
import static com.as.dndwebsite.race.subrace.SubRaceService.SUB_RACE_NOT_FOUND_MSG;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class RegionSubRaceService implements IRegionSubRaceService {
    private final RegionRepository regionRepository;
    private final SubRaceRepository subRaceRepository;

    @Override
    public Page<EntryDTO> getSubRacesRelatedToRegion(String name, PageInfo page) {
        Pageable paging = PageRequest.of(page.number() - 1, page.size(), Sort.by(Sort.Direction.DESC, "id"));
        return subRaceRepository.findAllByRegions_Name(name, paging);
    }

    @Override
    public List<EntryDTO> getSubRacesRelatedToRegion(Long id) {
        log.info("Getting races related to Region with id {}", id);
        return subRaceRepository.findAllByRegions_Id(id);
    }

    @Override
    public void addSubRaceRegionRelation(Long subRaceId, Long regionId) {
        SubRace subrace = subRaceRepository.findById(subRaceId).orElseThrow(() -> new NotFoundException(String.format(SUB_RACE_NOT_FOUND_MSG, subRaceId)));
        Region region = regionRepository.findById(regionId).orElseThrow(() -> new NotFoundException(String.format(REGION_NOT_FOUND_MSG, regionId)));
        region.getSubRaces().add(subrace);
    }

    @Override
    public void removeSubRaceRegionRelation(Long subRaceId, Long regionId) {
        SubRace subrace = subRaceRepository.findById(subRaceId).orElseThrow(() -> new NotFoundException(String.format(SUB_RACE_NOT_FOUND_MSG, subRaceId)));
        Region region = regionRepository.findById(regionId).orElseThrow(() -> new NotFoundException(String.format(REGION_NOT_FOUND_MSG, regionId)));
        region.getSubRaces().remove(subrace);
    }

    @Override
    public void addNewSubRaceToRegion(EntryDTO subRace, Long regionId) {
        Region region = regionRepository.findById(regionId).orElseThrow(() -> new NotFoundException(String.format(REGION_NOT_FOUND_MSG, regionId)));
        SubRace newSubRace = subRaceRepository.save(new SubRace(subRace.name(), subRace.description(), region));
        region.getSubRaces().add(newSubRace);
    }

    @Override
    public void addNewRegionSubRaceRelation(EntryDTO region, Long subRaceId) {
        SubRace subRace = subRaceRepository.findById(subRaceId).orElseThrow(() -> new NotFoundException(String.format(SUB_RACE_NOT_FOUND_MSG, subRaceId)));
        Region newRegion = regionRepository.save(new Region(region.name(), region.description(), subRace));
        subRace.getRegions().add(newRegion);
    }

    @Override
    public List<EntryDTO> getRegionsRelatedToSubRace(Long id) {
        return regionRepository.findAllBySubRaces_Id(id);
    }

    @Override
    public Page<EntryDTO> getRegionsRelatedToSubRace(String name, PageInfo page) {
        Pageable paging = PageRequest.of(page.number() - 1, page.size(), Sort.by(Sort.Direction.DESC, "id"));
        return regionRepository.findAllBySubRaces_Name(name, paging);
    }
}
