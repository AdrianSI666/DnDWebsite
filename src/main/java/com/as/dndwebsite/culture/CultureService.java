package com.as.dndwebsite.culture;

import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
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

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class CultureService implements ICultureService {
    private final CultureRepository cultureRepository;
    public static final String CULTURE_NOT_FOUND_MSG =
            "culture with name %s not found";
    private final DomainMapper<Entry, EntryDTO> mapper;

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
    public EntryDTO getCulture(String name) {
        log.info("Getting Culture with name: {}", name);
        return mapper.map(cultureRepository.findByName(name)
                .orElseThrow(() -> new NotFoundException(String.format(CULTURE_NOT_FOUND_MSG, name))));
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
