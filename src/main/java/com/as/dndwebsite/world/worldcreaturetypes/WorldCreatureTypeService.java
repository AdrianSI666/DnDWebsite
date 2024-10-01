package com.as.dndwebsite.world.worldcreaturetypes;

import com.as.dndwebsite.creatures.types.CreatureType;
import com.as.dndwebsite.creatures.types.CreatureTypeRepository;
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

import static com.as.dndwebsite.creatures.types.CreatureTypeService.CREATURE_TYPE_NOT_FOUND_MSG;
import static com.as.dndwebsite.world.WorldService.WORLD_NOT_FOUND_MSG;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class WorldCreatureTypeService implements IWorldCreatureTypeService {
    private final WorldRepository worldRepository;
    private final CreatureTypeRepository creatureTypeRepository;
    private final DomainMapper<Entry, EntryDTO> mapper;

    @Override
    public List<EntryDTO> getCreatureTypesRelatedToWorld(Long worldId) {
        log.debug("Getting creatureTypes related to world with id {}", worldId);
        return creatureTypeRepository.findAllByWorldId(worldId);
    }

    @Override
    public Page<EntryDTO> getCreatureTypesRelatedToWorld(String name, PageInfo page) {
        Pageable paging = PageRequest.of(page.number() - 1, page.size(), Sort.by(Sort.Direction.DESC, "id"));
        return creatureTypeRepository.findAllByWorldName(name, paging);
    }

    @Override
    public EntryDTO getWorldOfCreatureType(String name) {
        return worldRepository.findByCreatureTypes_Name(name).orElseThrow(() -> new NotFoundException(String.format(WORLD_NOT_FOUND_MSG, name)));
    }

    @Override
    public Optional<EntryDTO> getWorldOfCreatureType(Long id) {
        return worldRepository.findByCreatureTypes_Id(id);
    }

    @Override
    public EntryDTO addNewCreatureTypeWorldRelation(Long worldId, EntryDTO creatureType) {
        log.debug("Adding creatureType {} to world {}", creatureType.name(), worldId);
        World world = worldRepository.findById(worldId).orElseThrow(() -> new NotFoundException(String.format(WORLD_NOT_FOUND_MSG, worldId)));
        CreatureType newCreatureType = creatureTypeRepository.save(new CreatureType(creatureType.name(), creatureType.shortDescription(), world));
        world.getCreatureTypes().add(newCreatureType);
        return mapper.map(newCreatureType);
    }

    @Override
    public EntryDTO addNewWorldCreatureTypeRelation(Long creatureTypeId, EntryDTO world) {
        log.debug("Adding new world {} to creatureType {}", world.name(), creatureTypeId);
        CreatureType creatureType = creatureTypeRepository.findById(creatureTypeId).orElseThrow(() -> new NotFoundException(String.format(CREATURE_TYPE_NOT_FOUND_MSG, creatureTypeId)));
        World newWorld = worldRepository.save(new World(world.name(), world.shortDescription(), creatureType));
        creatureType.setWorld(newWorld);
        return mapper.map(newWorld);
    }

    @Override
    public void setWorldToCreatureTypeRelation(Long worldId, Long creatureTypeId) {
        log.debug("Adding world {} to creatureType {}", worldId, creatureTypeId);
        CreatureType creatureType = creatureTypeRepository.findById(creatureTypeId).orElseThrow(() -> new NotFoundException(String.format(CREATURE_TYPE_NOT_FOUND_MSG, creatureTypeId)));
        World world = worldRepository.findById(worldId).orElseThrow(() -> new NotFoundException(String.format(WORLD_NOT_FOUND_MSG, worldId)));
        if (!world.getCreatureTypes().add(creatureType))
            throw new BadRequestException("World %s and CreatureType %s are already linked".formatted(world.getName(), creatureType.getName()));
        creatureType.setWorld(world);
    }
}
