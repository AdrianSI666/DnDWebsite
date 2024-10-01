package com.as.dndwebsite.world.worldculture;

import com.as.dndwebsite.culture.Culture;
import com.as.dndwebsite.culture.CultureRepository;
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

import static com.as.dndwebsite.culture.CultureService.CULTURE_NOT_FOUND_MSG;
import static com.as.dndwebsite.world.WorldService.WORLD_NOT_FOUND_MSG;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class WorldCultureService implements IWorldCultureService {
    private final WorldRepository worldRepository;
    private final CultureRepository cultureRepository;
    private final DomainMapper<Entry, EntryDTO> mapper;

    @Override
    public List<EntryDTO> getCulturesRelatedToWorld(Long worldId) {
        log.debug("Getting cultures related to world with id {}", worldId);
        return cultureRepository.findAllByWorldId(worldId);
    }

    @Override
    public Page<EntryDTO> getCulturesRelatedToWorld(String name, PageInfo page) {
        Pageable paging = PageRequest.of(page.number() - 1, page.size(), Sort.by(Sort.Direction.DESC, "id"));
        return cultureRepository.findAllByWorldName(name, paging);
    }

    @Override
    public EntryDTO getWorldOfCulture(String name) {
        return worldRepository.findByCultures_Name(name).orElseThrow(() -> new NotFoundException(String.format(WORLD_NOT_FOUND_MSG, name)));
    }

    @Override
    public Optional<EntryDTO> getWorldOfCulture(Long id) {
        return worldRepository.findByCultures_Id(id);
    }

    @Override
    public EntryDTO addNewCultureWorldRelation(Long worldId, EntryDTO culture) {
        log.debug("Adding culture {} to world {}", culture.name(), worldId);
        World world = worldRepository.findById(worldId).orElseThrow(() -> new NotFoundException(String.format(WORLD_NOT_FOUND_MSG, worldId)));
        Culture newCulture = cultureRepository.save(new Culture(culture.name(), culture.shortDescription(), world));
        world.getCultures().add(newCulture);
        return mapper.map(newCulture);
    }

    @Override
    public EntryDTO addNewWorldCultureRelation(Long cultureId, EntryDTO world) {
        log.debug("Adding new world {} to culture {}", world.name(), cultureId);
        Culture culture = cultureRepository.findById(cultureId).orElseThrow(() -> new NotFoundException(String.format(CULTURE_NOT_FOUND_MSG, cultureId)));
        World newWorld = worldRepository.save(new World(world.name(), world.shortDescription(), culture));
        culture.setWorld(newWorld);
        return mapper.map(newWorld);
    }

    @Override
    public void setWorldToCultureRelation(Long worldId, Long cultureId) {
        log.debug("Adding world {} to culture {}", worldId, cultureId);
        Culture culture = cultureRepository.findById(cultureId).orElseThrow(() -> new NotFoundException(String.format(CULTURE_NOT_FOUND_MSG, cultureId)));
        World world = worldRepository.findById(worldId).orElseThrow(() -> new NotFoundException(String.format(WORLD_NOT_FOUND_MSG, worldId)));
        if (!world.getCultures().add(culture))
            throw new BadRequestException("World %s and Culture %s are already linked".formatted(world.getName(), culture.getName()));
        culture.setWorld(world);
    }
}
