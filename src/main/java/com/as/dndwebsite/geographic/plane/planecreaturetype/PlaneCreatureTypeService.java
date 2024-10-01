package com.as.dndwebsite.geographic.plane.planecreaturetype;

import com.as.dndwebsite.creatures.types.CreatureType;
import com.as.dndwebsite.creatures.types.CreatureTypeRepository;
import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import com.as.dndwebsite.exception.BadRequestException;
import com.as.dndwebsite.exception.NotFoundException;
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

import static com.as.dndwebsite.creatures.types.CreatureTypeService.CREATURE_TYPE_NOT_FOUND_MSG;
import static com.as.dndwebsite.geographic.plane.PlaneService.PLANE_NOT_FOUND_MSG;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class PlaneCreatureTypeService implements IPlaneCreatureTypeService {
    private final PlaneRepository planeRepository;
    private final CreatureTypeRepository creatureTypeRepository;
    private final DomainMapper<Entry, EntryDTO> mapper;
    @Override
    public List<EntryDTO> getCreatureTypesRelatedToPlane(Long planeId){
        return creatureTypeRepository.findAllByPlanes_Id(planeId);
    }
    @Override
    public Page<EntryDTO> getCreatureTypesRelatedToPlane(String name, PageInfo page) {
        Pageable paging = PageRequest.of(page.number() - 1, page.size(), Sort.by(Sort.Direction.DESC, "id"));
        return creatureTypeRepository.findAllByPlanes_Name(name, paging);
    }

    @Override
    public List<EntryDTO> getPlanesRelatedToCreatureType(Long planeId){
        return planeRepository.findAllByCreatureTypes_Id(planeId);
    }

    @Override
    public Page<EntryDTO> getPlanesRelatedToCreatureType(String name, PageInfo page) {
        Pageable paging = PageRequest.of(page.number() - 1, page.size(), Sort.by(Sort.Direction.DESC, "id"));
        return planeRepository.findAllByCreatureTypes_Name(name, paging);
    }

    @Override
    public EntryDTO addNewPlaneToCreatureTypeRelation(EntryDTO plane, Long creatureTypeId) {
        CreatureType creatureType = creatureTypeRepository.findById(creatureTypeId).orElseThrow(() -> new NotFoundException(String.format(CREATURE_TYPE_NOT_FOUND_MSG, creatureTypeId)));
        Plane newPlane = planeRepository.save(new Plane(plane.name(), plane.shortDescription(), creatureType));
        creatureType.getPlanes().add(newPlane);
        return mapper.map(newPlane);
    }

    @Override
    public EntryDTO addNewCreatureTypeToPlaneRelation(EntryDTO creatureType, Long planeId) {
        Plane plane = planeRepository.findById(planeId).orElseThrow(() -> new NotFoundException(String.format(PLANE_NOT_FOUND_MSG, planeId)));
        CreatureType newCreatureType = creatureTypeRepository.save(new CreatureType(creatureType.name(), creatureType.shortDescription(), plane));
        plane.getCreatureTypes().add(newCreatureType);
        return mapper.map(newCreatureType);
    }

    @Override
    public void addCreatureTypePlaneRelation(Long creatureTypeId, Long planeId) {
        CreatureType creatureType = creatureTypeRepository.findById(creatureTypeId).orElseThrow(() -> new NotFoundException(String.format(CREATURE_TYPE_NOT_FOUND_MSG, creatureTypeId)));
        Plane plane = planeRepository.findById(planeId).orElseThrow(() -> new NotFoundException(String.format(PLANE_NOT_FOUND_MSG, planeId)));
        if(!plane.getCreatureTypes().add(creatureType)) throw new BadRequestException("Plane %s and CreatureType %s are already linked".formatted(plane.getName(), creatureType.getName()));
        creatureType.getPlanes().add(plane);
    }

    @Override
    public void removeCreatureTypePlaneRelation(Long creatureTypeId, Long planeId) {
        CreatureType creatureType = creatureTypeRepository.findById(creatureTypeId).orElseThrow(() -> new NotFoundException(String.format(CREATURE_TYPE_NOT_FOUND_MSG, creatureTypeId)));
        Plane plane = planeRepository.findById(planeId).orElseThrow(() -> new NotFoundException(String.format(PLANE_NOT_FOUND_MSG, planeId)));
        plane.getCreatureTypes().remove(creatureType);
        creatureType.getPlanes().remove(plane);
    }


}
