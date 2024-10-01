package com.as.dndwebsite.world.worldplane;

import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import com.as.dndwebsite.exception.BadRequestException;
import com.as.dndwebsite.exception.NotFoundException;
import com.as.dndwebsite.world.World;
import com.as.dndwebsite.world.WorldRepository;
import com.as.dndwebsite.geographic.plane.Plane;
import com.as.dndwebsite.geographic.plane.PlaneRepository;
import com.as.dndwebsite.mappers.DomainMapper;
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
import static com.as.dndwebsite.geographic.plane.PlaneService.PLANE_NOT_FOUND_MSG;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class WorldPlaneService implements IWorldPlaneService {
    private final WorldRepository worldRepository;
    private final PlaneRepository planeRepository;
    private final DomainMapper<Entry, EntryDTO> mapper;

    @Override
    public List<EntryDTO> getPlanesRelatedToWorld(Long worldId) {
        log.debug("Getting planes related to world with id {}", worldId);
        return planeRepository.findAllByWorldId(worldId);
    }

    @Override
    public Page<EntryDTO> getPlanesRelatedToWorld(String name, PageInfo page) {
        Pageable paging = PageRequest.of(page.number() - 1, page.size(), Sort.by(Sort.Direction.DESC, "id"));
        return planeRepository.findAllByWorldName(name, paging);
    }

    @Override
    public EntryDTO getWorldOfPlane(String name) {
        return worldRepository.findByPlanes_Name(name).orElseThrow(() -> new NotFoundException(String.format(WORLD_NOT_FOUND_MSG, name)));
    }

    @Override
    public Optional<EntryDTO> getWorldOfPlane(Long id) {
        return worldRepository.findByPlanes_Id(id);
    }

    @Override
    public EntryDTO addNewPlaneWorldRelation(Long worldId, EntryDTO plane) {
        log.debug("Adding plane {} to world {}", plane.name(), worldId);
        World world = worldRepository.findById(worldId).orElseThrow(() -> new NotFoundException(String.format(WORLD_NOT_FOUND_MSG, worldId)));
        Plane newPlane = planeRepository.save(new Plane(plane.name(), plane.shortDescription(), world));
        world.getPlanes().add(newPlane);
        return mapper.map(newPlane);
    }

    @Override
    public EntryDTO addNewWorldPlaneRelation(Long planeId, EntryDTO world) {
        log.debug("Adding new world {} to plane {}", world.name(), planeId);
        Plane plane = planeRepository.findById(planeId).orElseThrow(() -> new NotFoundException(String.format(PLANE_NOT_FOUND_MSG, planeId)));
        World newWorld = worldRepository.save(new World(world.name(), world.shortDescription(), plane));
        plane.setWorld(newWorld);
        return mapper.map(newWorld);
    }

    @Override
    public void setWorldToPlaneRelation(Long worldId, Long planeId) {
        log.debug("Adding world {} to plane {}", worldId, planeId);
        Plane plane = planeRepository.findById(planeId).orElseThrow(() -> new NotFoundException(String.format(PLANE_NOT_FOUND_MSG, planeId)));
        World world = worldRepository.findById(worldId).orElseThrow(() -> new NotFoundException(String.format(WORLD_NOT_FOUND_MSG, worldId)));
        if(!world.getPlanes().add(plane)) throw new BadRequestException("World %s and Plane %s are already linked".formatted(world.getName(), plane.getName()));
        plane.setWorld(world);
    }
}
