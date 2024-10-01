package com.as.dndwebsite.creatures.types.species;

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
public class SpeciesService implements ISpeciesService {
    private final SpeciesRepository speciesRepository;
    public static final String SPECIES_NOT_FOUND_MSG = "species with name %s not found";
    private final DomainMapper<Entry, EntryDTO> mapper;
    private final DescriptionMapper descriptionMapper;
    private final ImageMapper imageMapper;

    @Override
    public Page<EntryDTO> getSpecies(PageInfo page) {
        log.info("Getting species");
        Pageable paging = PageRequest.of(page.number() - 1, page.size(), Sort.by(Sort.Direction.DESC, "id"));
        Page<Species> speciesPage = speciesRepository.findAll(paging);
        return speciesPage.map(mapper::map);
    }

    @Override
    public SpeciesDTO getSpecies(String name) {
        log.info("Getting species");
        Species species = speciesRepository.findByName(name).orElseThrow(
                () -> new NotFoundException(String.format(SPECIES_NOT_FOUND_MSG, name)));
        return new SpeciesDTO(mapper.map(species),
                species.getSubSpecies().stream().map(mapper::map).toList(),
                species.getDescriptions().stream().map(descriptionMapper::map).toList(),
                species.getImages().stream().map(imageMapper::map).toList(),
                species.getRegions().stream().map(mapper::map).toList());
    }

    @Override
    public EntryDTO saveSpecies(EntryDTO species) {
        log.info("Saving new species {}", species.name());
        Species savedSpecies = speciesRepository.save(new Species(species.name(), species.shortDescription()));
        return mapper.map(savedSpecies);
    }

    @Override
    public void updateSpecies(EntryDTO species, Long id) {
        log.info("Updating Species {} with id {}", species.name(), id);
        Species oldSpecies = speciesRepository.findById(id).orElseThrow(
                () -> new NotFoundException(String.format(SPECIES_NOT_FOUND_MSG, id)));
        oldSpecies.setName(species.name());
        oldSpecies.setShortDescription(species.shortDescription());
    }

    @Override
    public void deleteSpecies(Long id) {
        Species species = speciesRepository.findById(id).orElseThrow(
                () -> new NotFoundException(String.format(SPECIES_NOT_FOUND_MSG, id)));
        log.info("Deleting Species with id {}", id);
        speciesRepository.delete(species);
    }


    @Override
    public List<EntryDTO> getAllSpeciess() {
        return speciesRepository.findAll().stream().map(mapper::map).toList();
    }
}
