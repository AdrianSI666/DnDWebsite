package com.as.dndwebsite.culture;

import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.EntryFullDTO;
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
public class CultureService implements ICultureService {
    private final CultureRepository cultureRepository;
    public static final String CULTURE_NOT_FOUND_MSG =
            "culture with name %s not found";
    private final DomainMapper<Entry, EntryDTO> mapper;
    private final DescriptionMapper descriptionMapper;
    private final ImageMapper imageMapper;

    @Override
    public List<EntryDTO> getAllCultures() {
        return cultureRepository.findAll().stream().map(mapper::map).toList();
    }

    @Override
    public Page<EntryDTO> getCultures(PageInfo page) {
        log.info("Getting Cultures");
        Pageable paging = PageRequest.of(page.number() - 1, page.size(), Sort.by(Sort.Direction.DESC, "id"));
        Page<Culture> culturePage = cultureRepository.findAll(paging);
        return culturePage.map(mapper::map);
    }

    @Override
    public EntryFullDTO getCulture(String name) {
        log.info("Getting Culture with name: {}", name);
        Culture culture = cultureRepository.findByName(name)
                .orElseThrow(() -> new NotFoundException(String.format(CULTURE_NOT_FOUND_MSG, name)));
        return new EntryFullDTO(mapper.map(culture),
                null,
                culture.getRegions().stream().map(mapper::map).toList(),
                culture.getDescriptions().stream().map(descriptionMapper::map).toList(),
                culture.getImages().stream().map(imageMapper::map).toList());
    }

    @Override
    public EntryDTO saveCulture(EntryDTO culture) {
        log.info("Saving new Culture {}", culture.name());
        Culture savedCulture = cultureRepository.save(new Culture(culture.name(), culture.shortDescription()));
        return mapper.map(savedCulture);
    }

    @Override
    public void updateCulture(EntryDTO culture, Long id) {
        log.info("Updating Culture {} with id {}", culture.name(), id);
        Culture oldCulture = cultureRepository.findById(id).orElseThrow(
                () -> new NotFoundException(String.format(CULTURE_NOT_FOUND_MSG, id)));
        oldCulture.setName(culture.name());
        oldCulture.setShortDescription(culture.shortDescription());
    }

    @Override
    public void deleteCulture(Long id) {
        log.info("Deleting Culture with id {}", id);
        cultureRepository.deleteById(id);
    }
}
