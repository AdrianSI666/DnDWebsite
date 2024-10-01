package com.as.dndwebsite.world.worldsubspecies;

import com.as.dndwebsite.creatures.types.species.subspecies.SubSpecies;
import com.as.dndwebsite.creatures.types.species.subspecies.SubSpeciesRepository;
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

import static com.as.dndwebsite.creatures.types.species.subspecies.SubSpeciesService.SUB_SPECIES_NOT_FOUND_MSG;
import static com.as.dndwebsite.world.WorldService.WORLD_NOT_FOUND_MSG;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class WorldSubSpeciesService implements IWorldSubSpeciesService {
    private final WorldRepository worldRepository;
    private final SubSpeciesRepository subSpeciesRepository;
    private final DomainMapper<Entry, EntryDTO> mapper;

    @Override
    public List<EntryDTO> getSubSpeciesRelatedToWorld(Long worldId) {
        log.debug("Getting subspecies related to world with id {}", worldId);
        return subSpeciesRepository.findAllByWorldId(worldId);
    }

    @Override
    public Page<EntryDTO> getSubSpeciesRelatedToWorld(String name, PageInfo page) {
        Pageable paging = PageRequest.of(page.number() - 1, page.size(), Sort.by(Sort.Direction.DESC, "id"));
        return subSpeciesRepository.findAllByWorldName(name, paging);
    }

    @Override
    public EntryDTO getWorldOfSubSpecies(String name) {
        return worldRepository.findBySubSpecies_Name(name).orElseThrow(() -> new NotFoundException(String.format(WORLD_NOT_FOUND_MSG, name)));
    }

    @Override
    public Optional<EntryDTO> getWorldOfSubSpecies(Long id) {
        return worldRepository.findBySubSpecies_Id(id);
    }

    @Override
    public EntryDTO addNewSubSpeciesWorldRelation(Long worldId, EntryDTO subSpecies) {
        log.debug("Adding subspecies {} to world {}", subSpecies.name(), worldId);
        World world = worldRepository.findById(worldId).orElseThrow(() -> new NotFoundException(String.format(WORLD_NOT_FOUND_MSG, worldId)));
        SubSpecies newSubspecies = subSpeciesRepository.save(new SubSpecies(subSpecies.name(), subSpecies.shortDescription(), world));
        world.getSubSpecies().add(newSubspecies);
        return mapper.map(newSubspecies);
    }

    @Override
    public EntryDTO addNewWorldSubSpeciesRelation(Long subSpeciesId, EntryDTO world) {
        log.debug("Adding new world {} to subSpecies {}", world.name(), subSpeciesId);
        SubSpecies subSpecies = subSpeciesRepository.findById(subSpeciesId).orElseThrow(() -> new NotFoundException(String.format(SUB_SPECIES_NOT_FOUND_MSG, subSpeciesId)));
        World newWorld = worldRepository.save(new World(world.name(), world.shortDescription(), subSpecies));
        subSpecies.setWorld(newWorld);
        return mapper.map(newWorld);
    }

    @Override
    public void setWorldToSubSpeciesRelation(Long worldId, Long subSpeciesId) {
        log.debug("Adding world {} to subSpecies {}", worldId, subSpeciesId);
        SubSpecies subspecies = subSpeciesRepository.findById(subSpeciesId).orElseThrow(() -> new NotFoundException(String.format(SUB_SPECIES_NOT_FOUND_MSG, subSpeciesId)));
        World world = worldRepository.findById(worldId).orElseThrow(() -> new NotFoundException(String.format(WORLD_NOT_FOUND_MSG, worldId)));
        if (!world.getSubSpecies().add(subspecies))
            throw new BadRequestException("World %s and Subspecies %s are already linked".formatted(world.getName(), subspecies.getName()));
        subspecies.setWorld(world);
    }
}
