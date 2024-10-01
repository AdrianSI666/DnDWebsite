package com.as.dndwebsite.creatures.types.species.speciessubspecies;

import com.as.dndwebsite.creatures.types.species.Species;
import com.as.dndwebsite.creatures.types.species.SpeciesRepository;
import com.as.dndwebsite.creatures.types.species.SpeciesService;
import com.as.dndwebsite.creatures.types.species.subspecies.SubSpecies;
import com.as.dndwebsite.creatures.types.species.subspecies.SubSpeciesRepository;
import com.as.dndwebsite.creatures.types.species.subspecies.SubSpeciesService;
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

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class SpeciesSubSpeciesService implements ISpeciesSubSpeciesService {
    private final SpeciesRepository speciesRepository;
    private final SubSpeciesRepository subspeciesRepository;
    private final DomainMapper<Entry, EntryDTO> mapper;
    @Override
    public Page<EntryDTO> getSubSpeciesOfSpecies(String name, PageInfo page) {
        Pageable paging = PageRequest.of(page.number() - 1, page.size(), Sort.by(Sort.Direction.DESC, "id"));
        return subspeciesRepository.findAllBySpeciesName(name, paging);
    }

    @Override
    public List<EntryDTO> getSubSpeciesOfSpecies(Long id) {
        return subspeciesRepository.findAllBySpeciesId(id);
    }

    @Override
    public List<EntryDTO> getAllSubSpeciesWithoutSpecies() {
        return subspeciesRepository.findAllBySpeciesIdIsNull();
    }

    @Override
    public Optional<EntryDTO> getSpeciesOfSubSpecies(long id) {
        return speciesRepository.findBySubSpecies_Id(id);
    }

    @Override
    public EntryDTO getSpeciesOfSubSpecies(String name) {
        return speciesRepository.findBySubSpecies_Name(name).orElseThrow(() -> new NotFoundException(String.format(SpeciesService.SPECIES_NOT_FOUND_MSG, name)));
    }

    @Override
    public EntryDTO addNewSubSpeciesSpeciesRelation(Long speciesId, EntryDTO subSpecies) {
        log.info("Adding subSpecies {} to species {}", subSpecies.name(), speciesId);
        Species species = speciesRepository.findById(speciesId).orElseThrow(() -> new NotFoundException(String.format(SpeciesService.SPECIES_NOT_FOUND_MSG, speciesId)));
        SubSpecies newSubspecies = subspeciesRepository.save(new SubSpecies(subSpecies.name(), subSpecies.shortDescription(), species));
        species.getSubSpecies().add(newSubspecies);
        return mapper.map(newSubspecies);
    }

    @Override
    public EntryDTO addNewSpeciesSubSpeciesRelation(Long subSpeciesId, EntryDTO species) {
        SubSpecies subSpecies = subspeciesRepository.findById(subSpeciesId).orElseThrow(() -> new NotFoundException(String.format(SubSpeciesService.SUB_SPECIES_NOT_FOUND_MSG, subSpeciesId)));
        Species newSpecies = speciesRepository.save(new Species(species.name(), species.shortDescription(), subSpecies));
        subSpecies.setSpecies(newSpecies);
        return mapper.map(newSpecies);
    }

    @Override
    public void addSubSpeciesSpeciesRelation(Long speciesId, Long subSpeciesId) {
        log.info("Adding subSpecies {} to species {}", subSpeciesId, speciesId);
        Species species = speciesRepository.findById(speciesId).orElseThrow(() -> new NotFoundException(String.format(SpeciesService.SPECIES_NOT_FOUND_MSG, speciesId)));
        SubSpecies subspecies = subspeciesRepository.findById(subSpeciesId).orElseThrow(() -> new NotFoundException(String.format(SubSpeciesService.SUB_SPECIES_NOT_FOUND_MSG, subSpeciesId)));
        if(!species.getSubSpecies().add(subspecies)) throw new BadRequestException("Species %s and Sub Species %s are already linked".formatted(species.getName(), subspecies.getName()));
        subspecies.setSpecies(species);
    }

    @Override
    public void removeSubSpeciesSpeciesRelation(Long speciesId, Long subSpeciesId) {
        log.info("Deleting subSpecies {} from species {}", subSpeciesId, speciesId);
        Species species = speciesRepository.findById(speciesId).orElseThrow(() -> new NotFoundException(String.format(SpeciesService.SPECIES_NOT_FOUND_MSG, speciesId)));
        SubSpecies subspecies = subspeciesRepository.findById(subSpeciesId).orElseThrow(() -> new NotFoundException(String.format(SubSpeciesService.SUB_SPECIES_NOT_FOUND_MSG, subSpeciesId)));
        species.getSubSpecies().remove(subspecies);
        subspecies.setSpecies(null);
    }


}
