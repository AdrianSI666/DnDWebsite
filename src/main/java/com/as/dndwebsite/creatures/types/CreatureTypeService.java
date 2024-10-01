package com.as.dndwebsite.creatures.types;

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
public class CreatureTypeService implements ICreatureTypeService {
    private final CreatureTypeRepository creatureTypeRepository;
    public static final String CREATURE_TYPE_NOT_FOUND_MSG = "creatureType with name %s not found";
    private final DomainMapper<Entry, EntryDTO> mapper;
    private final DescriptionMapper descriptionMapper;
    private final ImageMapper imageMapper;

    @Override
    public Page<EntryDTO> getCreatureTypes(PageInfo page) {
        log.info("Getting creatureTypes");
        Pageable paging = PageRequest.of(page.number() - 1, page.size(), Sort.by(Sort.Direction.DESC, "id"));
        Page<CreatureType> creatureTypePage = creatureTypeRepository.findAll(paging);
        return creatureTypePage.map(mapper::map);
    }

    @Override
    public CreatureTypeDTO getCreatureType(String name) {
        log.info("Getting creatureType");
        CreatureType creatureType = creatureTypeRepository.findByName(name).orElseThrow(
                () -> new NotFoundException(String.format(CREATURE_TYPE_NOT_FOUND_MSG, name)));
        return new CreatureTypeDTO(mapper.map(creatureType),
                creatureType.getSpecies().stream().map(mapper::map).toList(),
                creatureType.getDescriptions().stream().map(descriptionMapper::map).toList(),
                creatureType.getImages().stream().map(imageMapper::map).toList(),
                creatureType.getPlanes().stream().map(mapper::map).toList());
    }

    @Override
    public EntryDTO saveCreatureType(EntryDTO creatureType) {
        log.info("Saving new creatureType {}", creatureType.name());
        CreatureType savedCreatureType = creatureTypeRepository.save(new CreatureType(creatureType.name(), creatureType.shortDescription()));
        return mapper.map(savedCreatureType);
    }

    @Override
    public void updateCreatureType(EntryDTO creatureType, Long id) {
        log.info("Updating CreatureType {} with id {}", creatureType.name(), id);
        CreatureType oldCreatureType = creatureTypeRepository.findById(id).orElseThrow(
                () -> new NotFoundException(String.format(CREATURE_TYPE_NOT_FOUND_MSG, id)));
        oldCreatureType.setName(creatureType.name());
        oldCreatureType.setShortDescription(creatureType.shortDescription());
    }

    @Override
    public void deleteCreatureType(long id) {
        CreatureType creatureType = creatureTypeRepository.findById(id).orElseThrow(
                () -> new NotFoundException(String.format(CREATURE_TYPE_NOT_FOUND_MSG, id)));
        log.info("Deleting CreatureType with id {}", id);
        creatureTypeRepository.delete(creatureType);
    }


    @Override
    public List<EntryDTO> getAllCreatureTypes() {
        return creatureTypeRepository.findAll().stream().map(mapper::map).toList();
    }
}
