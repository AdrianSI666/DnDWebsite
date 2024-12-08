package com.as.dndwebsite.creatures.types.species;

import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import com.as.dndwebsite.exception.NotFoundException;
import com.as.dndwebsite.mappers.DescriptionMapper;
import com.as.dndwebsite.mappers.DomainMapper;
import com.as.dndwebsite.mappers.ImageMapper;
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
public class SpeciesService implements ISpeciesService {
    private final SpeciesRepository speciesRepository;
    private final WorldRepository worldRepository;
    public static final String SPECIES_NOT_FOUND_MSG = "species with name %s not found";
    private final DomainMapper<Entry, EntryDTO> mapper;
    private final DescriptionMapper descriptionMapper;
    private final ImageMapper imageMapper;
    private final OwningSecurityFunctions owningSecurityFunctions;
    @Override
    public Page<EntryDTO> getSpecies(PageInfo page) {
        log.debug("Getting species of page");
        Pageable paging = PageRequest.of(page.number() - 1, page.size(), Sort.by(Sort.Direction.DESC, "id"));
        Page<Species> speciesPage = speciesRepository.findAll(paging);
        return speciesPage.map(mapper::map);
    }

    @Override
    public SpeciesDTO getSpecies(String name) {
        log.debug("Getting species");
        Species species = speciesRepository.findByName(name).orElseThrow(
                () -> new NotFoundException(String.format(SPECIES_NOT_FOUND_MSG, name)));
        Optional<EntryDTO> creatureType = Optional.empty();
        if(species.getCreatureType() != null) creatureType = Optional.of(mapper.map(species.getCreatureType()));
        return new SpeciesDTO(
                creatureType,
                mapper.map(species),
                species.getSubSpecies().stream().map(mapper::map).toList(),
                species.getDescriptions().stream().map(descriptionMapper::map).toList(),
                species.getImages().stream().map(imageMapper::map).toList(),
                species.getRegions().stream().map(mapper::map).toList());
    }

    @Override
    public EntryDTO saveSpecies(EntryDTO species, Long worldId) {
        log.debug("Saving new species {}", species.name());
        World world = worldRepository.findById(worldId).orElseThrow(
                () -> new NotFoundException(String.format(WORLD_NOT_FOUND_MSG, worldId)));
        owningSecurityFunctions.checkIfLoggedInUserIsTheSameAsAuthor(world.getAuthor(), "Save new world", world.getId());
        Species savedSpecies = speciesRepository.save(new Species(species.name(), species.shortDescription(), world));
        return mapper.map(savedSpecies);
    }

    @Override
    public void updateSpecies(EntryDTO species, Long id) {
        log.debug("Updating Species {} with id {}", species.name(), id);
        Species oldSpecies = speciesRepository.findById(id).orElseThrow(
                () -> new NotFoundException(String.format(SPECIES_NOT_FOUND_MSG, id)));
        owningSecurityFunctions.checkIfLoggedInUserIsTheSameAsAuthor(oldSpecies.getWorld().getAuthor(), "Update specie", oldSpecies.getId());
        oldSpecies.setName(species.name());
        oldSpecies.setShortDescription(species.shortDescription());
    }

    @Override
    public void deleteSpecies(Long id) {
        Species species = speciesRepository.findById(id).orElseThrow(
                () -> new NotFoundException(String.format(SPECIES_NOT_FOUND_MSG, id)));
        owningSecurityFunctions.checkIfLoggedInUserIsTheSameAsAuthor(species.getWorld().getAuthor(), "Delete species", species.getId());
        log.debug("Deleting Species with id {}", id);
        speciesRepository.delete(species);
    }


    @Override
    public List<EntryDTO> getAllSpecies() {
        return speciesRepository.findAll().stream().map(mapper::map).toList();
    }
}
