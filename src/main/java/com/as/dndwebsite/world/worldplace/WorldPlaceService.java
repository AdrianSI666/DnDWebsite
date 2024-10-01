package com.as.dndwebsite.world.worldplace;

import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import com.as.dndwebsite.exception.BadRequestException;
import com.as.dndwebsite.exception.NotFoundException;
import com.as.dndwebsite.mappers.DomainMapper;
import com.as.dndwebsite.geographic.plane.continent.region.place.Place;
import com.as.dndwebsite.geographic.plane.continent.region.place.PlaceRepository;
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

import static com.as.dndwebsite.geographic.plane.continent.region.place.PlaceService.PLACE_NOT_FOUND_MSG;
import static com.as.dndwebsite.world.WorldService.WORLD_NOT_FOUND_MSG;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class WorldPlaceService implements IWorldPlaceService {
    private final WorldRepository worldRepository;
    private final PlaceRepository placeRepository;
    private final DomainMapper<Entry, EntryDTO> mapper;

    @Override
    public List<EntryDTO> getPlacesRelatedToWorld(Long worldId) {
        log.debug("Getting places related to world with id {}", worldId);
        return placeRepository.findAllByWorldId(worldId);
    }

    @Override
    public Page<EntryDTO> getPlacesRelatedToWorld(String name, PageInfo page) {
        Pageable paging = PageRequest.of(page.number() - 1, page.size(), Sort.by(Sort.Direction.DESC, "id"));
        return placeRepository.findAllByWorldName(name, paging);
    }

    @Override
    public EntryDTO getWorldOfPlace(String name) {
        return worldRepository.findByPlaces_Name(name).orElseThrow(() -> new NotFoundException(String.format(WORLD_NOT_FOUND_MSG, name)));
    }

    @Override
    public Optional<EntryDTO> getWorldOfPlace(Long id) {
        return worldRepository.findByPlaces_Id(id);
    }

    @Override
    public EntryDTO addNewPlaceWorldRelation(Long worldId, EntryDTO place) {
        log.debug("Adding place {} to world {}", place.name(), worldId);
        World world = worldRepository.findById(worldId).orElseThrow(() -> new NotFoundException(String.format(WORLD_NOT_FOUND_MSG, worldId)));
        Place newPlace = placeRepository.save(new Place(place.name(), place.shortDescription(), world));
        world.getPlaces().add(newPlace);
        return mapper.map(newPlace);
    }

    @Override
    public EntryDTO addNewWorldPlaceRelation(Long placeId, EntryDTO world) {
        log.debug("Adding new world {} to place {}", world.name(), placeId);
        Place place = placeRepository.findById(placeId).orElseThrow(() -> new NotFoundException(String.format(PLACE_NOT_FOUND_MSG, placeId)));
        World newWorld = worldRepository.save(new World(world.name(), world.shortDescription(), place));
        place.setWorld(newWorld);
        return mapper.map(newWorld);
    }

    @Override
    public void setWorldToPlaceRelation(Long worldId, Long placeId) {
        log.debug("Adding world {} to place {}", worldId, placeId);
        Place place = placeRepository.findById(placeId).orElseThrow(() -> new NotFoundException(String.format(PLACE_NOT_FOUND_MSG, placeId)));
        World world = worldRepository.findById(worldId).orElseThrow(() -> new NotFoundException(String.format(WORLD_NOT_FOUND_MSG, worldId)));
        if(!world.getPlaces().add(place)) throw new BadRequestException("World %s and Place %s are already linked".formatted(world.getName(), place.getName()));
        place.setWorld(world);
    }
}
