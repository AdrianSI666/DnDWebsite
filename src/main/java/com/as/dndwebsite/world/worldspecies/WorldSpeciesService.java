package com.as.dndwebsite.world.worldspecies;

import com.as.dndwebsite.creatures.types.species.Species;
import com.as.dndwebsite.creatures.types.species.SpeciesRepository;
import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import com.as.dndwebsite.exception.BadRequestException;
import com.as.dndwebsite.exception.NotFoundException;
import com.as.dndwebsite.mappers.DomainMapper;
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
import static com.as.dndwebsite.creatures.types.species.SpeciesService.SPECIES_NOT_FOUND_MSG;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class WorldSpeciesService implements IWorldSpeciesService {
    private final WorldRepository worldRepository;
    private final SpeciesRepository speciesRepository;
    private final DomainMapper<Entry, EntryDTO> mapper;

    @Override
    public List<EntryDTO> getSpeciesRelatedToWorld(Long worldId) {
        log.debug("Getting species related to world with id {}", worldId);
        return speciesRepository.findAllByWorldId(worldId);
    }

    @Override
    public Page<EntryDTO> getSpeciesRelatedToWorld(String name, PageInfo page) {
        Pageable paging = PageRequest.of(page.number() - 1, page.size(), Sort.by(Sort.Direction.DESC, "id"));
        return speciesRepository.findAllByWorldName(name, paging);
    }

    @Override
    public EntryDTO getWorldOfSpecies(String name) {
        return worldRepository.findBySpecies_Name(name).orElseThrow(() -> new NotFoundException(String.format(WORLD_NOT_FOUND_MSG, name)));
    }

    @Override
    public Optional<EntryDTO> getWorldOfSpecies(Long id) {
        return worldRepository.findBySpecies_Id(id);
    }

    @Override
    public EntryDTO addNewSpeciesWorldRelation(Long worldId, EntryDTO species) {
        log.debug("Adding species {} to world {}", species.name(), worldId);
        World world = worldRepository.findById(worldId).orElseThrow(() -> new NotFoundException(String.format(WORLD_NOT_FOUND_MSG, worldId)));
        Species newSpecies = speciesRepository.save(new Species(species.name(), species.shortDescription(), world));
        world.getSpecies().add(newSpecies);
        return mapper.map(newSpecies);
    }

    @Override
    public EntryDTO addNewWorldSpeciesRelation(Long speciesId, EntryDTO world) {
        log.debug("Adding new world {} to species {}", world.name(), speciesId);
        Species species = speciesRepository.findById(speciesId).orElseThrow(() -> new NotFoundException(String.format(SPECIES_NOT_FOUND_MSG, speciesId)));
        World newWorld = worldRepository.save(new World(world.name(), world.shortDescription(), species));
        species.setWorld(newWorld);
        return mapper.map(newWorld);
    }

    @Override
    public void setWorldToSpeciesRelation(Long worldId, Long speciesId) {
        log.debug("Adding world {} to species {}", worldId, speciesId);
        Species species = speciesRepository.findById(speciesId).orElseThrow(() -> new NotFoundException(String.format(SPECIES_NOT_FOUND_MSG, speciesId)));
        World world = worldRepository.findById(worldId).orElseThrow(() -> new NotFoundException(String.format(WORLD_NOT_FOUND_MSG, worldId)));
        if (!world.getSpecies().add(species))
            throw new BadRequestException("World %s and Species %s are already linked".formatted(world.getName(), species.getName()));
        species.setWorld(world);
    }
}
