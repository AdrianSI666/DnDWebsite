package com.as.dndwebsite.maps.plane;

import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import com.as.dndwebsite.exception.NotFoundException;
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

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class PlaneService implements IPlaneService {
    private final PlaneRepository planeRepository;
    private final DomainMapper<Entry, EntryDTO> mapper;
    public static final String PLANE_NOT_FOUND_MSG =
            "Plane with name %s not found";

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
    public EntryDTO getPlane(String name) {
        log.info("Getting plane with name {}", name);
        return planeRepository.findByName(name).orElseThrow(
                () -> new NotFoundException(PLANE_NOT_FOUND_MSG.formatted(name)));
    }

    @Override
    public EntryDTO savePlane(EntryDTO plane) {
        log.info("Saving new plane {}", plane.name());
        return mapper.map(planeRepository.save(new Plane(plane.name(), plane.shortDescription())));
    }

    @Override
    public void updatePlane(EntryDTO plane, Long id) {
        log.info("Updating Plane {} with id {}", plane.name(), id);
        Plane oldPlane = planeRepository.findById(id).orElseThrow(
                () -> new NotFoundException(PLANE_NOT_FOUND_MSG.formatted(id)));
        oldPlane.setName(plane.name());
        oldPlane.setShortDescription(plane.shortDescription());
    }

    @Override
    public void deletePlane(Long id) {
        Plane plane = planeRepository.findById(id).orElseThrow(
                () -> new NotFoundException(PLANE_NOT_FOUND_MSG.formatted(id)));
        log.info("Deleting Plane with id {}", id);
        planeRepository.delete(plane);
    }
}
