package com.as.dndwebsite.world;

import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import com.as.dndwebsite.exception.NotFoundException;
import com.as.dndwebsite.mappers.DescriptionMapper;
import com.as.dndwebsite.mappers.DomainMapper;
import com.as.dndwebsite.mappers.ImageMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class WorldService implements IWorldService {
    private final WorldRepository worldRepository;
    private final DomainMapper<Entry, EntryDTO> mapper;
    private final DescriptionMapper descriptionMapper;
    private final ImageMapper imageMapper;
    public static final String WORLD_NOT_FOUND_MSG =
            "World with name %s not found";

    @Override
    public Page<EntryDTO> getWorlds(PageInfo page) {
        Pageable paging = PageRequest.of(page.number() - 1, page.size(), Sort.by(Sort.Direction.DESC, "id"));
        Page<World> worldPage = worldRepository.findAll(paging);
        return worldPage.map(mapper::map);
    }

    @Override
    public List<EntryDTO> getAllWorlds() {
        return worldRepository.findAll().stream().map(mapper::map).toList();
    }

    @Override
    public WorldDTO getWorld(String name) {
        log.info("Getting world with name {}", name);
        World world = worldRepository.findByName(name).orElseThrow(
                () -> new NotFoundException(WORLD_NOT_FOUND_MSG.formatted(name)));
        return new WorldDTO(mapper.map(world),
                world.getDescriptions().stream().map(descriptionMapper::map).toList(),
                world.getImages().stream().map(imageMapper::map).toList());
    }

    @Override
    public EntryDTO saveWorld(EntryDTO world) {
        log.info("Saving new world {}", world.name());
        return mapper.map(worldRepository.save(new World(world.name(), world.shortDescription())));
    }

    @Override
    public void updateWorld(EntryDTO world, Long id) {
        log.info("Updating world {} with id {}", world.name(), id);
        World oldWorld = worldRepository.findById(id).orElseThrow(
                () -> new NotFoundException(WORLD_NOT_FOUND_MSG.formatted(id)));
        oldWorld.setName(world.name());
        oldWorld.setShortDescription(world.shortDescription());
    }

    @Override
    public void deleteWorld(Long id) {
        log.info("Deleting world with id {}", id);
        World world = worldRepository.findById(id).orElseThrow(
                () -> new NotFoundException(WORLD_NOT_FOUND_MSG.formatted(id)));
        worldRepository.delete(world);
    }
}
