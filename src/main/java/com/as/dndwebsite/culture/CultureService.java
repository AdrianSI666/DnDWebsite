package com.as.dndwebsite.culture;

import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import com.as.dndwebsite.exception.NotFoundException;
import com.as.dndwebsite.util.DomainMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class CultureService {
    private final CultureRepository cultureRepository;
    public static final String CULTURE_NOT_FOUND_MSG =
            "culture with name %s not found";
    private final DomainMapper<Entry, EntryDTO> mapper;

    public Page<EntryDTO> getCultures(PageInfo page) {
        log.info("Getting Cultures");
        Pageable paging = PageRequest.of(page.number() - 1, page.size(), Sort.by(Sort.Direction.DESC, "id"));
        Page<Culture> documentPage = cultureRepository.findAll(paging);
        return documentPage.map(mapper::map);
    }

    public EntryDTO getCulture(String name) {
        log.info("Getting Culture with name: " + name);
        return mapper.map(cultureRepository.findByName(name)
                .orElseThrow(() -> new NotFoundException(String.format(CULTURE_NOT_FOUND_MSG, name))));
    }

    public EntryDTO saveCulture(EntryDTO culture) {
        log.info("Saving new Culture {}", culture.name());
        Culture savedCulture = cultureRepository.save(new Culture(culture.name(), culture.description()));
        return mapper.map(savedCulture);
    }

    public void updateCulture(EntryDTO culture, Long id) {
        log.info("Updating Culture {} with id {}", culture.name(), id);
        Culture oldCulture = cultureRepository.findById(id).orElseThrow(
                () -> new NotFoundException(String.format(CULTURE_NOT_FOUND_MSG, id)));
        oldCulture.setName(culture.name());
        oldCulture.setDescription(culture.description());
    }

    public void deleteCulture(Long id) {
        log.info("Deleting Culture with id {}", id);
        cultureRepository.deleteById(id);
    }
}
