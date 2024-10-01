package com.as.dndwebsite.creatures.types.species.subspecies;

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

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class SubSpeciesService implements ISubSpeciesService {
    private final SubSpeciesRepository subspeciesRepository;
    public static final String SUB_SPECIES_NOT_FOUND_MSG =
            "SubSpecies with name %s not found";
    private final DomainMapper<Entry, EntryDTO> mapper;
    private final DescriptionMapper descriptionMapper;
    private final ImageMapper imageMapper;

    @Override
    public Page<EntryDTO> getSubSpecies(PageInfo page) {
        log.info("Getting SubSpeciess");
        Pageable paging = PageRequest.of(page.number() - 1, page.size(), Sort.by(Sort.Direction.DESC, "id"));
        Page<SubSpecies> subSpeciesPage = subspeciesRepository.findAll(paging);
        return subSpeciesPage.map(mapper::map);
    }

    @Override
    public List<EntryDTO> getAllSubSpecies() {
        return subspeciesRepository.findAll().stream().map(mapper::map).toList();
    }

    @Override
    public SubSpeciesDTO getSubSpeciesByName(String name) {
        log.info("Getting SubSpecies with name: " + name);
        SubSpecies subSpecies = subspeciesRepository.findByName(name).orElseThrow(
                () -> new NotFoundException(String.format(SUB_SPECIES_NOT_FOUND_MSG, name)));
        Optional<EntryDTO> species = Optional.empty();
        if(subSpecies.getSpecies() != null) species = Optional.of(mapper.map(subSpecies.getSpecies()));
        return new SubSpeciesDTO(mapper.map(subSpecies),
                species,
                subSpecies.getDescriptions().stream().map(descriptionMapper::map).toList(),
                subSpecies.getImages().stream().map(imageMapper::map).toList(),
                subSpecies.getRegions().stream().map(mapper::map).toList());
    }

    @Override
    public EntryDTO saveSubSpecies(EntryDTO entryDTO) {
        log.info("Saving new SubSpecies {}", entryDTO.name());
        SubSpecies subSpecies = new SubSpecies(entryDTO.name(), entryDTO.shortDescription());
        subSpecies.setImages(new ArrayList<>());
        return mapper.map(subspeciesRepository.save(subSpecies));
    }

    @Override
    public void updateSubSpecies(EntryDTO entryDTO, Long id) {
        log.info("Updating SubSpecies {} with id {}", entryDTO.name(), id);
        SubSpecies oldSubspecies = subspeciesRepository.findById(id).orElseThrow(
                () -> new NotFoundException(String.format(SUB_SPECIES_NOT_FOUND_MSG, id)));
        oldSubspecies.setName(entryDTO.name());
        oldSubspecies.setShortDescription(entryDTO.shortDescription());
    }

    @Override
    public void deleteSubSpecies(Long id) {
        log.info("Deleting SubSpecies with id {}", id);
        subspeciesRepository.deleteById(id);
    }
}
