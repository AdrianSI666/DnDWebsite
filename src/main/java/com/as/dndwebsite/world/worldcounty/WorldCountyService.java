package com.as.dndwebsite.world.worldcounty;

import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import com.as.dndwebsite.exception.BadRequestException;
import com.as.dndwebsite.exception.NotFoundException;
import com.as.dndwebsite.mappers.DomainMapper;
import com.as.dndwebsite.political.kingdom.county.County;
import com.as.dndwebsite.political.kingdom.county.CountyRepository;
import com.as.dndwebsite.world.World;
import com.as.dndwebsite.world.WorldRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import static com.as.dndwebsite.world.WorldService.WORLD_NOT_FOUND_MSG;
import static com.as.dndwebsite.political.kingdom.county.CountyService.COUNTY_NOT_FOUND_MSG;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class WorldCountyService implements IWorldCountyService {
    private final WorldRepository worldRepository;
    private final CountyRepository countyRepository;
    private final DomainMapper<Entry, EntryDTO> mapper;

    @Override
    public List<EntryDTO> getCountiesRelatedToWorld(Long worldId) {
        log.debug("Getting countys related to world with id {}", worldId);
        return countyRepository.findAllByWorldId(worldId);
    }

    @Override
    public Page<EntryDTO> getCountiesRelatedToWorld(String name, PageInfo page) {
        Pageable paging = PageRequest.of(page.number() - 1, page.size(), Sort.by(Sort.Direction.DESC, "id"));
        return countyRepository.findAllByWorldName(name, paging);
    }

    @Override
    public EntryDTO getWorldOfCounty(String name) {
        return worldRepository.findByCounties_Name(name).orElseThrow(() -> new NotFoundException(String.format(WORLD_NOT_FOUND_MSG, name)));
    }

    @Override
    public Optional<EntryDTO> getWorldOfCounty(Long id) {
        return worldRepository.findByCounties_Id(id);
    }

    @Override
    public EntryDTO addNewCountyWorldRelation(Long worldId, EntryDTO county) {
        log.debug("Adding county {} to world {}", county.name(), worldId);
        World world = worldRepository.findById(worldId).orElseThrow(() -> new NotFoundException(String.format(WORLD_NOT_FOUND_MSG, worldId)));
        County newCounty = countyRepository.save(new County(county.name(), county.shortDescription(), world));
        world.getCounties().add(newCounty);
        return mapper.map(newCounty);
    }

    @Override
    public EntryDTO addNewWorldCountyRelation(Long countyId, EntryDTO world) {
        log.debug("Adding new world {} to county {}", world.name(), countyId);
        County county = countyRepository.findById(countyId).orElseThrow(() -> new NotFoundException(String.format(COUNTY_NOT_FOUND_MSG, countyId)));
        World newWorld = worldRepository.save(new World(world.name(), world.shortDescription(), county));
        county.setWorld(newWorld);
        return mapper.map(newWorld);
    }

    @Override
    public void setWorldToCountyRelation(Long worldId, Long countyId) {
        log.debug("Adding world {} to county {}", worldId, countyId);
        County county = countyRepository.findById(countyId).orElseThrow(() -> new NotFoundException(String.format(COUNTY_NOT_FOUND_MSG, countyId)));
        World world = worldRepository.findById(worldId).orElseThrow(() -> new NotFoundException(String.format(WORLD_NOT_FOUND_MSG, worldId)));
        if(!world.getCounties().add(county)) throw new BadRequestException("World %s and County %s are already linked".formatted(world.getName(), county.getName()));
        county.setWorld(world);
    }
}
