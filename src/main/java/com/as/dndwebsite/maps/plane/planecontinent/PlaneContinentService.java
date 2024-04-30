package com.as.dndwebsite.maps.plane.planecontinent;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import com.as.dndwebsite.exception.NotFoundException;
import com.as.dndwebsite.maps.plane.Plane;
import com.as.dndwebsite.maps.plane.PlaneRepository;
import com.as.dndwebsite.maps.plane.continent.Continent;
import com.as.dndwebsite.maps.plane.continent.ContinentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.as.dndwebsite.maps.plane.PlaneService.PLANE_NOT_FOUND_MSG;
import static com.as.dndwebsite.maps.plane.continent.ContinentService.CONTINENT_NOT_FOUND_MSG;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class PlaneContinentService implements IPlaneContinentService {
    private final PlaneRepository planeRepository;
    private final ContinentRepository continentRepository;

    @Override
    public List<EntryDTO> getContinentsRelatedToPlane(Long planeId) {
        log.info("Getting continents related to plane with id {}", planeId);
        return continentRepository.findAllByPlaneId(planeId);
    }

    @Override
    public Page<EntryDTO> getContinentsRelatedToPlane(String name, PageInfo page) {
        Pageable paging = PageRequest.of(page.number() - 1, page.size(), Sort.by(Sort.Direction.DESC, "id"));
        return continentRepository.findAllByPlaneName(name, paging);
    }

    @Override
    public EntryDTO getPlaneOfContinent(String name) {
        return planeRepository.findByContinents_Name(name).orElseThrow(() -> new NotFoundException(String.format(PLANE_NOT_FOUND_MSG, name)));
    }

    @Override
    public EntryDTO getPlaneOfContinent(Long id) {
        return planeRepository.findByContinents_Id(id).orElseThrow(() -> new NotFoundException(String.format(PLANE_NOT_FOUND_MSG, id)));
    }

    @Override
    public void addNewContinentPlaneRelation(Long planeId, EntryDTO continent) {
        log.info("Adding continent {} to plane {}", continent.name(), planeId);
        Plane plane = planeRepository.findById(planeId).orElseThrow(() -> new NotFoundException(String.format(PLANE_NOT_FOUND_MSG, planeId)));
        Continent newContinent = continentRepository.save(new Continent(continent.name(), continent.description(), plane));
        plane.getContinents().add(newContinent);
    }

    @Override
    public void removeContinentPlaneRelation(Long planeId, Long continentId) {
        log.info("Removing continent {} from plane {}", continentId, planeId);
        Plane plane = planeRepository.findById(planeId).orElseThrow(() -> new NotFoundException(String.format(PLANE_NOT_FOUND_MSG, planeId)));
        Continent continent = continentRepository.findById(continentId).orElseThrow(() -> new NotFoundException(String.format(CONTINENT_NOT_FOUND_MSG, continentId)));
        plane.getContinents().remove(continent);
        continent.setPlane(null);
    }

    @Override
    public void addContinentPlaneRelation(Long planeId, Long continentId) {
        log.info("Adding continent {} to plane {}", continentId, planeId);
        Plane plane = planeRepository.findById(planeId).orElseThrow(() -> new NotFoundException(String.format(PLANE_NOT_FOUND_MSG, planeId)));
        Continent continent = continentRepository.findById(continentId).orElseThrow(() -> new NotFoundException(String.format(CONTINENT_NOT_FOUND_MSG, continentId)));
        plane.getContinents().add(continent);
        continent.setPlane(plane);
    }


    @Override
    public void addNewPlaneContinentRelation(Long continentId, EntryDTO plane) {
        log.info("Setting new plane {} to continent {}", plane.name(), continentId);
        Continent continent = continentRepository.findById(continentId).orElseThrow(() -> new NotFoundException(String.format(CONTINENT_NOT_FOUND_MSG, continentId)));
        Plane newPlane = planeRepository.save(new Plane(plane.name(), plane.description(), continent));
        continent.setPlane(newPlane);

    }
}