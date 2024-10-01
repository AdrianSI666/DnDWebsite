package com.as.dndwebsite.world.worldkingdom;

import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import com.as.dndwebsite.exception.BadRequestException;
import com.as.dndwebsite.exception.NotFoundException;
import com.as.dndwebsite.mappers.DomainMapper;
import com.as.dndwebsite.political.kingdom.Kingdom;
import com.as.dndwebsite.political.kingdom.KingdomRepository;
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

import static com.as.dndwebsite.political.kingdom.KingdomService.KINGDOM_NOT_FOUND_MSG;
import static com.as.dndwebsite.world.WorldService.WORLD_NOT_FOUND_MSG;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class WorldKingdomService implements IWorldKingdomService {
    private final WorldRepository worldRepository;
    private final KingdomRepository kingdomRepository;
    private final DomainMapper<Entry, EntryDTO> mapper;

    @Override
    public List<EntryDTO> getKingdomsRelatedToWorld(Long worldId) {
        log.debug("Getting kingdoms related to world with id {}", worldId);
        return kingdomRepository.findAllByWorldId(worldId);
    }

    @Override
    public Page<EntryDTO> getKingdomsRelatedToWorld(String name, PageInfo page) {
        Pageable paging = PageRequest.of(page.number() - 1, page.size(), Sort.by(Sort.Direction.DESC, "id"));
        return kingdomRepository.findAllByWorldName(name, paging);
    }

    @Override
    public EntryDTO getWorldOfKingdom(String name) {
        return worldRepository.findByKingdoms_Name(name).orElseThrow(() -> new NotFoundException(String.format(WORLD_NOT_FOUND_MSG, name)));
    }

    @Override
    public Optional<EntryDTO> getWorldOfKingdom(Long id) {
        return worldRepository.findByKingdoms_Id(id);
    }

    @Override
    public EntryDTO addNewKingdomWorldRelation(Long worldId, EntryDTO kingdom) {
        log.debug("Adding kingdom {} to world {}", kingdom.name(), worldId);
        World world = worldRepository.findById(worldId).orElseThrow(() -> new NotFoundException(String.format(WORLD_NOT_FOUND_MSG, worldId)));
        Kingdom newKingdom = kingdomRepository.save(new Kingdom(kingdom.name(), kingdom.shortDescription(), world));
        world.getKingdoms().add(newKingdom);
        return mapper.map(newKingdom);
    }

    @Override
    public EntryDTO addNewWorldKingdomRelation(Long kingdomId, EntryDTO world) {
        log.debug("Adding new world {} to kingdom {}", world.name(), kingdomId);
        Kingdom kingdom = kingdomRepository.findById(kingdomId).orElseThrow(() -> new NotFoundException(String.format(KINGDOM_NOT_FOUND_MSG, kingdomId)));
        World newWorld = worldRepository.save(new World(world.name(), world.shortDescription(), kingdom));
        kingdom.setWorld(newWorld);
        return mapper.map(newWorld);
    }

    @Override
    public void setWorldToKingdomRelation(Long worldId, Long kingdomId) {
        log.debug("Adding world {} to kingdom {}", worldId, kingdomId);
        Kingdom kingdom = kingdomRepository.findById(kingdomId).orElseThrow(() -> new NotFoundException(String.format(KINGDOM_NOT_FOUND_MSG, kingdomId)));
        World world = worldRepository.findById(worldId).orElseThrow(() -> new NotFoundException(String.format(WORLD_NOT_FOUND_MSG, worldId)));
        if(!world.getKingdoms().add(kingdom)) throw new BadRequestException("World %s and Kingdom %s are already linked".formatted(world.getName(), kingdom.getName()));
        kingdom.setWorld(world);
    }
}
