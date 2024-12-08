package com.as.dndwebsite.political.kingdom;

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

import static com.as.dndwebsite.world.WorldService.WORLD_NOT_FOUND_MSG;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class KingdomService implements IKingdomService {
    private final KingdomRepository kingdomRepository;
    private final WorldRepository worldRepository;
    private final DomainMapper<Entry, EntryDTO> mapper;
    private final DescriptionMapper descriptionMapper;
    private final ImageMapper imageMapper;
    public static final String KINGDOM_NOT_FOUND_MSG =
            "kingdom with name %s not found";
    private final OwningSecurityFunctions owningSecurityFunctions;

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
    public EntryDTO saveKingdom(EntryDTO kingdom, Long worldId) {
        log.debug("Saving new kingdom {}", kingdom.name());
        World world = worldRepository.findById(worldId).orElseThrow(
                () -> new NotFoundException(String.format(WORLD_NOT_FOUND_MSG, worldId)));
        owningSecurityFunctions.checkIfLoggedInUserIsTheSameAsAuthor(world.getAuthor(), "Save new kingdom", world.getId());
        return mapper.map(kingdomRepository.save(new Kingdom(kingdom.name(), kingdom.shortDescription(), world)));
    }

    @Override
    public void updateKingdom(EntryDTO kingdom, Long kingdomId) {
        log.debug("Updating continent {} with id {}", kingdom.name(), kingdomId);
        Kingdom oldKingdom = kingdomRepository.findById(kingdomId).orElseThrow(
                () -> new NotFoundException(String.format(KINGDOM_NOT_FOUND_MSG, kingdomId)));
        owningSecurityFunctions.checkIfLoggedInUserIsTheSameAsAuthor(oldKingdom.getWorld().getAuthor(), "Update kingdom", oldKingdom.getId());
        oldKingdom.setShortDescription(kingdom.shortDescription());
        oldKingdom.setName(kingdom.name());
    }

    @Override
    public void deleteKingdom(Long id) {
        log.debug("Deleting kingdom with id: {}", id);
        Kingdom kingdom = kingdomRepository.findById(id).orElseThrow(
                () -> new NotFoundException(String.format(KINGDOM_NOT_FOUND_MSG, id)));
        owningSecurityFunctions.checkIfLoggedInUserIsTheSameAsAuthor(kingdom.getWorld().getAuthor(), "Delete kingdom", kingdom.getId());
        kingdomRepository.delete(kingdom);
    }

    @Override
    public List<EntryDTO> getAllKingdoms() {
        return kingdomRepository.findAll().stream().map(mapper::map).toList();
    }
}
