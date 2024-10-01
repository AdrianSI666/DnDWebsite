package com.as.dndwebsite.political.kingdom;

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
public class KingdomService implements IKingdomService {
    private final KingdomRepository kingdomRepository;
    private final DomainMapper<Entry, EntryDTO> mapper;
    private final DescriptionMapper descriptionMapper;
    private final ImageMapper imageMapper;
    public static final String KINGDOM_NOT_FOUND_MSG =
            "kingdom with name %s not found";

    @Override
    public Page<EntryDTO> getKingdoms(PageInfo page) {
        log.info("Getting kingdoms");
        Pageable paging = PageRequest.of(page.number() - 1, page.size(), Sort.by(Sort.Direction.DESC, "id"));
        Page<Kingdom> kingdomPage = kingdomRepository.findAll(paging);
        return kingdomPage.map(mapper::map);
    }

    @Override
    public KingdomDTO getKingdom(String name) {
        log.info("Getting kingdom");
        Kingdom kingdom = kingdomRepository.findByName(name).orElseThrow(
                () -> new NotFoundException(String.format(KINGDOM_NOT_FOUND_MSG, name)));
        return new KingdomDTO(mapper.map(kingdom),
                kingdom.getCounties().stream().map(mapper::map).toList(),
                kingdom.getContinents().stream().map(mapper::map).toList(),
                kingdom.getDescriptions().stream().map(descriptionMapper::map).toList(),
                kingdom.getImages().stream().map(imageMapper::map).toList());
    }

    @Override
    public EntryDTO saveKingdom(EntryDTO kingdom) {
        log.info("Saving new kingdom {}", kingdom.name());
        return mapper.map(kingdomRepository.save(new Kingdom(kingdom.name(), kingdom.shortDescription())));
    }

    @Override
    public void updateKingdom(EntryDTO kingdom, Long kingdomId) {
        log.info("Updating continent {} with id {}", kingdom.name(), kingdomId);
        Kingdom oldKingdom = kingdomRepository.findById(kingdomId).orElseThrow(
                () -> new NotFoundException(String.format(KINGDOM_NOT_FOUND_MSG, kingdomId)));
        oldKingdom.setShortDescription(kingdom.shortDescription());
        oldKingdom.setName(kingdom.name());
    }

    @Override
    public void deleteKingdom(Long id) {
        log.info("Deleting kingdom with id: " + id);
        kingdomRepository.deleteById(id);
    }

    @Override
    public List<EntryDTO> getAllKingdoms() {
        return kingdomRepository.findAll().stream().map(mapper::map).toList();
    }
}
