package com.as.dndwebsite.world.worldcontinent;

import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import com.as.dndwebsite.exception.BadRequestException;
import com.as.dndwebsite.exception.NotFoundException;
import com.as.dndwebsite.mappers.DomainMapper;
import com.as.dndwebsite.geographic.plane.continent.Continent;
import com.as.dndwebsite.geographic.plane.continent.ContinentRepository;
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

import static com.as.dndwebsite.geographic.plane.continent.ContinentService.CONTINENT_NOT_FOUND_MSG;
import static com.as.dndwebsite.world.WorldService.WORLD_NOT_FOUND_MSG;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class WorldContinentService implements IWorldContinentService {
    private final WorldRepository worldRepository;
    private final ContinentRepository continentRepository;
    private final DomainMapper<Entry, EntryDTO> mapper;

    @Override
    public List<EntryDTO> getContinentsRelatedToWorld(Long worldId) {
        log.debug("Getting continents related to world with id {}", worldId);
        return continentRepository.findAllByWorldId(worldId);
    }

    @Override
    public Page<EntryDTO> getContinentsRelatedToWorld(String name, PageInfo page) {
        Pageable paging = PageRequest.of(page.number() - 1, page.size(), Sort.by(Sort.Direction.DESC, "id"));
        return continentRepository.findAllByWorldName(name, paging);
    }

    @Override
    public EntryDTO getWorldOfContinent(String name) {
        return worldRepository.findByContinents_Name(name).orElseThrow(() -> new NotFoundException(String.format(WORLD_NOT_FOUND_MSG, name)));
    }

    @Override
    public Optional<EntryDTO> getWorldOfContinent(Long id) {
        return worldRepository.findByContinents_Id(id);
    }

    @Override
    public EntryDTO addNewContinentWorldRelation(Long worldId, EntryDTO continent) {
        log.debug("Adding continent {} to world {}", continent.name(), worldId);
        World world = worldRepository.findById(worldId).orElseThrow(() -> new NotFoundException(String.format(WORLD_NOT_FOUND_MSG, worldId)));
        Continent newContinent = continentRepository.save(new Continent(continent.name(), continent.shortDescription(), world));
        world.getContinents().add(newContinent);
        return mapper.map(newContinent);
    }

    @Override
    public EntryDTO addNewWorldContinentRelation(Long continentId, EntryDTO world) {
        log.debug("Adding new world {} to continent {}", world.name(), continentId);
        Continent continent = continentRepository.findById(continentId).orElseThrow(() -> new NotFoundException(String.format(CONTINENT_NOT_FOUND_MSG, continentId)));
        World newWorld = worldRepository.save(new World(world.name(), world.shortDescription(), continent));
        continent.setWorld(newWorld);
        return mapper.map(newWorld);
    }

    @Override
    public void setWorldToContinentRelation(Long worldId, Long continentId) {
        log.debug("Adding world {} to continent {}", worldId, continentId);
        Continent continent = continentRepository.findById(continentId).orElseThrow(() -> new NotFoundException(String.format(CONTINENT_NOT_FOUND_MSG, continentId)));
        World world = worldRepository.findById(worldId).orElseThrow(() -> new NotFoundException(String.format(WORLD_NOT_FOUND_MSG, worldId)));
        if(!world.getContinents().add(continent)) throw new BadRequestException("World %s and Continent %s are already linked".formatted(world.getName(), continent.getName()));
        continent.setWorld(world);
    }
}
