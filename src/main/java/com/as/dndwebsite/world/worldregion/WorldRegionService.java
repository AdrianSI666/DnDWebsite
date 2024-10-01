package com.as.dndwebsite.world.worldregion;

import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import com.as.dndwebsite.exception.BadRequestException;
import com.as.dndwebsite.exception.NotFoundException;
import com.as.dndwebsite.mappers.DomainMapper;
import com.as.dndwebsite.geographic.plane.continent.region.Region;
import com.as.dndwebsite.geographic.plane.continent.region.RegionRepository;
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

import static com.as.dndwebsite.geographic.plane.continent.region.RegionService.REGION_NOT_FOUND_MSG;
import static com.as.dndwebsite.world.WorldService.WORLD_NOT_FOUND_MSG;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class WorldRegionService implements IWorldRegionService {
    private final WorldRepository worldRepository;
    private final RegionRepository regionRepository;
    private final DomainMapper<Entry, EntryDTO> mapper;

    @Override
    public List<EntryDTO> getRegionsRelatedToWorld(Long worldId) {
        log.debug("Getting regions related to world with id {}", worldId);
        return regionRepository.findAllByWorldId(worldId);
    }

    @Override
    public Page<EntryDTO> getRegionsRelatedToWorld(String name, PageInfo page) {
        Pageable paging = PageRequest.of(page.number() - 1, page.size(), Sort.by(Sort.Direction.DESC, "id"));
        return regionRepository.findAllByWorldName(name, paging);
    }

    @Override
    public EntryDTO getWorldOfRegion(String name) {
        return worldRepository.findByRegions_Name(name).orElseThrow(() -> new NotFoundException(String.format(WORLD_NOT_FOUND_MSG, name)));
    }

    @Override
    public Optional<EntryDTO> getWorldOfRegion(Long id) {
        return worldRepository.findByRegions_Id(id);
    }

    @Override
    public EntryDTO addNewRegionWorldRelation(Long worldId, EntryDTO region) {
        log.debug("Adding region {} to world {}", region.name(), worldId);
        World world = worldRepository.findById(worldId).orElseThrow(() -> new NotFoundException(String.format(WORLD_NOT_FOUND_MSG, worldId)));
        Region newRegion = regionRepository.save(new Region(region.name(), region.shortDescription(), world));
        world.getRegions().add(newRegion);
        return mapper.map(newRegion);
    }

    @Override
    public EntryDTO addNewWorldRegionRelation(Long regionId, EntryDTO world) {
        log.debug("Adding new world {} to region {}", world.name(), regionId);
        Region region = regionRepository.findById(regionId).orElseThrow(() -> new NotFoundException(String.format(REGION_NOT_FOUND_MSG, regionId)));
        World newWorld = worldRepository.save(new World(world.name(), world.shortDescription(), region));
        region.setWorld(newWorld);
        return mapper.map(newWorld);
    }

    @Override
    public void setWorldToRegionRelation(Long worldId, Long regionId) {
        log.debug("Adding world {} to region {}", worldId, regionId);
        Region region = regionRepository.findById(regionId).orElseThrow(() -> new NotFoundException(String.format(REGION_NOT_FOUND_MSG, regionId)));
        World world = worldRepository.findById(worldId).orElseThrow(() -> new NotFoundException(String.format(WORLD_NOT_FOUND_MSG, worldId)));
        if (!world.getRegions().add(region))
            throw new BadRequestException("World %s and Region %s are already linked".formatted(world.getName(), region.getName()));
        region.setWorld(world);
    }
}
