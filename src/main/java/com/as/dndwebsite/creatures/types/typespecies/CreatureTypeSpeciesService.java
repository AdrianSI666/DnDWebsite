package com.as.dndwebsite.creatures.types.typespecies;

import com.as.dndwebsite.creatures.types.CreatureType;
import com.as.dndwebsite.creatures.types.CreatureTypeRepository;
import com.as.dndwebsite.creatures.types.species.Species;
import com.as.dndwebsite.creatures.types.species.SpeciesRepository;
import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import com.as.dndwebsite.exception.BadRequestException;
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
import java.util.Optional;

import static com.as.dndwebsite.creatures.types.CreatureTypeService.CREATURE_TYPE_NOT_FOUND_MSG;
import static com.as.dndwebsite.creatures.types.species.SpeciesService.SPECIES_NOT_FOUND_MSG;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class CreatureTypeSpeciesService implements ICreatureTypeSpeciesService {
    private final CreatureTypeRepository creatureTypeRepository;
    private final SpeciesRepository speciesRepository;
    private final DomainMapper<Entry, EntryDTO> mapper;
    @Override
    public Page<EntryDTO> getSpeciesOfCreatureType(String name, PageInfo page) {
        Pageable paging = PageRequest.of(page.number() - 1, page.size(), Sort.by(Sort.Direction.DESC, "id"));
        return speciesRepository.findAllByCreatureTypeName(name, paging);
    }

    @Override
    public List<EntryDTO> getSpeciesOfCreatureType(Long id) {
        return speciesRepository.findAllByCreatureTypeId(id);
    }

    @Override
    public List<EntryDTO> getAllSpeciesWithoutCreatureType() {
        return speciesRepository.findAllByCreatureTypeIdIsNull();
    }

    @Override
    public Optional<EntryDTO> getCreatureTypeOfSpecies(long id) {
        return creatureTypeRepository.findBySpecies_Id(id);
    }

    @Override
    public EntryDTO getCreatureTypeOfSpecies(String name) {
        return creatureTypeRepository.findBySpecies_Name(name).orElseThrow(() -> new NotFoundException(String.format(CREATURE_TYPE_NOT_FOUND_MSG, name)));
    }

    @Override
    public EntryDTO addNewSpeciesCreatureTypeRelation(Long creatureTypeId, EntryDTO species) {
        log.info("Adding new species {} to creatureType {}", species.name(), creatureTypeId);
        CreatureType creatureType = creatureTypeRepository.findById(creatureTypeId).orElseThrow(() -> new NotFoundException(String.format(CREATURE_TYPE_NOT_FOUND_MSG, creatureTypeId)));
        Species newSpecies = speciesRepository.save(new Species(species.name(), species.shortDescription(), creatureType));
        creatureType.getSpecies().add(newSpecies);
        return mapper.map(newSpecies);
    }

    @Override
    public EntryDTO addNewCreatureTypeSpeciesRelation(Long speciesId, EntryDTO creatureType) {
        Species species = speciesRepository.findById(speciesId).orElseThrow(() -> new NotFoundException(String.format(SPECIES_NOT_FOUND_MSG, speciesId)));
        CreatureType newCreatureType = creatureTypeRepository.save(new CreatureType(creatureType.name(), creatureType.shortDescription(), species));
        species.setCreatureType(newCreatureType);
        return mapper.map(newCreatureType);
    }

    @Override
    public void addSpeciesCreatureTypeRelation(Long creatureTypeId, Long speciesId) {
        log.info("Adding species {} to creatureType {}", speciesId, creatureTypeId);
        CreatureType creatureType = creatureTypeRepository.findById(creatureTypeId).orElseThrow(() -> new NotFoundException(String.format(CREATURE_TYPE_NOT_FOUND_MSG, creatureTypeId)));
        Species species = speciesRepository.findById(speciesId).orElseThrow(() -> new NotFoundException(String.format(SPECIES_NOT_FOUND_MSG, speciesId)));
        if(!creatureType.getSpecies().add(species)) throw new BadRequestException("CreatureType %s and Sub CreatureType %s are already linked".formatted(creatureType.getName(), species.getName()));
        species.setCreatureType(creatureType);
    }

    @Override
    public void removeSpeciesCreatureTypeRelation(Long creatureTypeId, Long speciesId) {
        log.info("Deleting species {} from creatureType {}", speciesId, creatureTypeId);
        CreatureType creatureType = creatureTypeRepository.findById(creatureTypeId).orElseThrow(() -> new NotFoundException(String.format(CREATURE_TYPE_NOT_FOUND_MSG, creatureTypeId)));
        Species species = speciesRepository.findById(speciesId).orElseThrow(() -> new NotFoundException(String.format(SPECIES_NOT_FOUND_MSG, speciesId)));
        creatureType.getSpecies().remove(species);
        species.setCreatureType(null);
    }


}
