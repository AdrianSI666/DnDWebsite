package com.as.dndwebsite.maps.worldplane;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import com.as.dndwebsite.exception.NotFoundException;
import com.as.dndwebsite.maps.World;
import com.as.dndwebsite.maps.WorldRepository;
import com.as.dndwebsite.maps.plane.Plane;
import com.as.dndwebsite.maps.plane.PlaneRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.as.dndwebsite.maps.WorldService.WORLD_NOT_FOUND_MSG;
import static com.as.dndwebsite.maps.plane.PlaneService.PLANE_NOT_FOUND_MSG;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class WorldPlaneService implements IWorldPlaneService {
    private final WorldRepository worldRepository;
    private final PlaneRepository planeRepository;

    @Override
    public List<EntryDTO> getPlanesRelatedToWorld(Long worldId) {
        log.info("Getting planes related to world with id {}", worldId);
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
    public EntryDTO getWorldOfPlane(Long id) {
        return worldRepository.findByPlanes_Id(id).orElseThrow(() -> new NotFoundException(String.format(WORLD_NOT_FOUND_MSG, id)));
    }

    @Override
    public void addNewPlaneWorldRelation(Long worldId, EntryDTO plane) {
        log.info("Adding plane {} to world {}", plane.name(), worldId);
        World world = worldRepository.findById(worldId).orElseThrow(() -> new NotFoundException(String.format(WORLD_NOT_FOUND_MSG, worldId)));
        Plane newPlane = planeRepository.save(new Plane(plane.name(), plane.description(), world));
        world.getPlanes().add(newPlane);
    }

    @Override
    public void addNewWorldPlaneRelation(Long planeId, EntryDTO world) {
        log.info("Adding world {} to plane {}", world.name(), planeId);
        Plane plane = planeRepository.findById(planeId).orElseThrow(() -> new NotFoundException(String.format(PLANE_NOT_FOUND_MSG, planeId)));
        World newWord = worldRepository.save(new World(world.name(), world.description(), plane));
        plane.setWorld(newWord);
    }

    @Override
    public void addPlaneWorldRelation(Long worldId, Long planeId) {
        log.info("Adding world {} to plane {}", worldId, planeId);
        Plane plane = planeRepository.findById(planeId).orElseThrow(() -> new NotFoundException(String.format(PLANE_NOT_FOUND_MSG, planeId)));
        World world = worldRepository.findById(worldId).orElseThrow(() -> new NotFoundException(String.format(WORLD_NOT_FOUND_MSG, worldId)));
        plane.setWorld(world);
        world.getPlanes().add(plane);
    }

    @Override
    public void removePlaneWorldRelation(Long worldId, Long planeId) {
        log.info("Removing plane {} and world {} relation.", planeId, worldId);
        World world = worldRepository.findById(worldId).orElseThrow(() -> new NotFoundException(String.format(WORLD_NOT_FOUND_MSG, worldId)));
        Plane plane = planeRepository.findById(planeId).orElseThrow(() -> new NotFoundException(String.format(PLANE_NOT_FOUND_MSG, planeId)));
        world.getPlanes().remove(plane);
        plane.setWorld(null);
    }
}