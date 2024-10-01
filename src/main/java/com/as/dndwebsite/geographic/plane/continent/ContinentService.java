package com.as.dndwebsite.geographic.plane.continent;

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
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class ContinentService implements IContinentService {
    private final ContinentRepository continentRepository;

    private final DomainMapper<Entry, EntryDTO> mapper;
    private final DescriptionMapper descriptionMapper;
    private final ImageMapper imageMapper;
    public static final String CONTINENT_NOT_FOUND_MSG =
            "Continent with name %s not found";

    @Override
    public Page<EntryDTO> getContinents(PageInfo page) {
        log.info("Getting Continents");
        Pageable paging = PageRequest.of(page.number() - 1, page.size(), Sort.by(Sort.Direction.DESC, "id"));
        Page<Continent> continentPage = continentRepository.findAll(paging);
        return continentPage.map(mapper::map);
    }

    @Override
    public List<EntryDTO> getAllContinents() {
        return continentRepository.findAll().stream().map(mapper::map).toList();
    }

    @Override
    public ContinentDTO getContinent(String name) {
        log.info("Getting Continent");
        Continent continent = continentRepository.findByName(name).orElseThrow(
                () -> new NotFoundException(String.format(CONTINENT_NOT_FOUND_MSG, name)));
        Optional<EntryDTO> plane = Optional.empty();
        if(continent.getPlane() != null) plane = Optional.of(mapper.map(continent.getPlane()));
        return new ContinentDTO(mapper.map(continent),
                plane,
                continent.getRegions().stream().map(mapper::map).toList(),
                continent.getKingdoms().stream().map(mapper::map).toList(),
                continent.getDescriptions().stream().map(descriptionMapper::map).toList(),
                continent.getImages().stream().map(imageMapper::map).toList());
    }

    @Override
    public EntryDTO saveContinent(EntryDTO continent) {
        log.info("Saving new Continent {}", continent.name());
        return mapper.map(continentRepository.save(new Continent(continent.name(), continent.shortDescription())));
    }

    @Override
    public void updateContinent(EntryDTO continent, Long id) {
        Continent oldContinent = continentRepository.findById(id).orElseThrow(
                () -> new NotFoundException(String.format(CONTINENT_NOT_FOUND_MSG, id)));
        log.info("Updating continent {} with id {}", oldContinent.getName(), id);
        oldContinent.setShortDescription(continent.shortDescription());
        oldContinent.setName(continent.name());
    }

    @Override
    public void deleteContinent(Long id) {
        log.info("Deleting continent with id: " + id);
        continentRepository.deleteById(id);
    }

}
