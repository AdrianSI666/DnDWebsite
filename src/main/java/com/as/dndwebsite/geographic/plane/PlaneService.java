package com.as.dndwebsite.geographic.plane;

import com.as.dndwebsite.description.Description;
import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.dto.DescriptionDTO;
import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.ImageDTO;
import com.as.dndwebsite.dto.PageInfo;
import com.as.dndwebsite.exception.NotFoundException;
import com.as.dndwebsite.image.Image;
import com.as.dndwebsite.mappers.DomainMapper;
import com.as.dndwebsite.mappers.WorldMapper;
import com.as.dndwebsite.security.OwningSecurityFunctions;
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

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class PlaneService implements IPlaneService {
    private final PlaneRepository planeRepository;
    private final WorldRepository worldRepository;
    private final DomainMapper<Entry, EntryDTO> mapper;
    private final DomainMapper<Description, DescriptionDTO> descriptionMapper;
    private final DomainMapper<Image, ImageDTO> imageMapper;
    public static final String PLANE_NOT_FOUND_MSG =
            "Plane with name %s not found";
    private final WorldMapper worldMapper;
    private final OwningSecurityFunctions owningSecurityFunctions;
    @Override
    public Page<EntryDTO> getPlanes(PageInfo page) {
        Pageable paging = PageRequest.of(page.number() - 1, page.size(), Sort.by(Sort.Direction.DESC, "id"));
        Page<Plane> planePage = planeRepository.findAll(paging);
        return planePage.map(mapper::map);
    }

    @Override
    public List<EntryDTO> getAllPlanes() {
        return planeRepository.findAll().stream().map(mapper::map).toList();
    }

    @Override
    public PlaneFullDTO getPlane(String name) {
        log.info("Getting plane with name {}", name);
        Plane plane = planeRepository.findByName(name).orElseThrow(
                () -> new NotFoundException(PLANE_NOT_FOUND_MSG.formatted(name)));
        return new PlaneFullDTO(mapper.map(plane),
                worldMapper.map(plane.getWorld()),
                plane.getImages().stream().map(imageMapper::map).toList(),
                plane.getDescriptions().stream().map(descriptionMapper::map).toList(),
                plane.getContinents().stream().map(mapper::map).toList(),
                plane.getCreatureTypes().stream().map(mapper::map).toList());
    }

    @Override
    public EntryDTO savePlane(EntryDTO plane, Long worldId) {
        log.info("Saving new plane {}", plane.name());
        World world = worldRepository.findById(worldId).orElseThrow(
                () -> new NotFoundException(String.format(WORLD_NOT_FOUND_MSG, worldId)));
        owningSecurityFunctions.checkIfLoggedInUserIsTheSameAsAuthor(world.getAuthor(), "Save new plane", world.getId());
        return mapper.map(planeRepository.save(new Plane(plane.name(), plane.shortDescription(), world)));
    }

    @Override
    public void updatePlane(EntryDTO plane, Long id) {
        log.info("Updating Plane {} with id {}", plane.name(), id);
        Plane oldPlane = planeRepository.findById(id).orElseThrow(
                () -> new NotFoundException(PLANE_NOT_FOUND_MSG.formatted(id)));
        owningSecurityFunctions.checkIfLoggedInUserIsTheSameAsAuthor(oldPlane.getWorld().getAuthor(), "Update plane", oldPlane.getId());
        oldPlane.setName(plane.name());
        oldPlane.setShortDescription(plane.shortDescription());
    }

    @Override
    public void deletePlane(Long id) {
        Plane plane = planeRepository.findById(id).orElseThrow(
                () -> new NotFoundException(PLANE_NOT_FOUND_MSG.formatted(id)));
        owningSecurityFunctions.checkIfLoggedInUserIsTheSameAsAuthor(plane.getWorld().getAuthor(), "Delete plane", plane.getId());
        log.info("Deleting Plane with id {}", id);
        planeRepository.delete(plane);
    }
}
