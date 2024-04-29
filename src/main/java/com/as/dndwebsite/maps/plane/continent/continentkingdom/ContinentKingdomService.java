package com.as.dndwebsite.maps.plane.continent.continentkingdom;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import com.as.dndwebsite.exception.NotFoundException;
import com.as.dndwebsite.maps.plane.continent.Continent;
import com.as.dndwebsite.maps.plane.continent.ContinentRepository;
import com.as.dndwebsite.maps.plane.continent.kingdom.Kingdom;
import com.as.dndwebsite.maps.plane.continent.kingdom.KingdomRepository;
import com.as.dndwebsite.maps.plane.continent.kingdom.KingdomService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.as.dndwebsite.maps.plane.continent.ContinentService.CONTINENT_NOT_FOUND_MSG;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class ContinentKingdomService implements IContinentKingdomService {
    private final KingdomRepository kingdomRepository;
    private final ContinentRepository continentRepository;

    @Override
    public List<EntryDTO> getKingdomsRelatedToContinent(Long continentId) {
        log.info("Getting kingdoms related to continent with id {}", continentId);
        return kingdomRepository.findAllByContinentId(continentId);
    }

    @Override
    public EntryDTO getContinentOfKingdom(String name) {
        return continentRepository.findByKingdoms_Name(name).orElseThrow(() -> new NotFoundException(String.format(CONTINENT_NOT_FOUND_MSG, name)));
    }

    @Override
    public EntryDTO getContinentOfKingdom(Long id) {
        return continentRepository.findByKingdoms_Id(id).orElseThrow(() -> new NotFoundException(String.format(CONTINENT_NOT_FOUND_MSG, id)));
    }

    @Override
    public void addNewKingdomContinentRelation(Long continentId, EntryDTO kingdom) {
        log.info("Adding kingdom {} to continent {}", kingdom.name(), continentId);
        Continent continent = continentRepository.findById(continentId).orElseThrow(() -> new NotFoundException(String.format(CONTINENT_NOT_FOUND_MSG, continentId)));
        Kingdom newKingdom = kingdomRepository.save(new Kingdom(kingdom.name(), kingdom.description(), continent));
        continent.getKingdoms().add(newKingdom);
    }

    @Override
    public void removeKingdomContinentRelation(Long continentId, Long kingdomId) {
        log.info("Removing kingdom {} from continent {}", kingdomId, continentId);
        Continent continent = continentRepository.findById(continentId).orElseThrow(() -> new NotFoundException(String.format(CONTINENT_NOT_FOUND_MSG, continentId)));
        Kingdom kingdom = kingdomRepository.findById(kingdomId).orElseThrow(() -> new NotFoundException(String.format(KingdomService.KINGDOM_NOT_FOUND_MSG, kingdomId)));
        continent.getKingdoms().remove(kingdom);
        kingdom.setContinent(null);
    }

    @Override
    public void addKingdomContinentRelation(Long continentId, Long kingdomId) {
        log.info("Adding kingdom {} to continent {}", kingdomId, continentId);
        Continent continent = continentRepository.findById(continentId).orElseThrow(() -> new NotFoundException(String.format(CONTINENT_NOT_FOUND_MSG, continentId)));
        Kingdom kingdom = kingdomRepository.findById(continentId).orElseThrow(() -> new NotFoundException(String.format(KingdomService.KINGDOM_NOT_FOUND_MSG, continentId)));
        continent.getKingdoms().add(kingdom);
        kingdom.setContinent(continent);
    }

    @Override
    public Page<EntryDTO> getKingdomsRelatedToContinent(String name, PageInfo page) {
        Pageable paging = PageRequest.of(page.number() - 1, page.size(), Sort.by(Sort.Direction.DESC, "id"));
        return kingdomRepository.findAllByContinentName(name, paging);
    }

    @Override
    public void addNewContinentKingdomRelation(Long kingdomId, EntryDTO continent) {
        Kingdom kingdom = kingdomRepository.findById(kingdomId).orElseThrow(() -> new NotFoundException(String.format(KingdomService.KINGDOM_NOT_FOUND_MSG, kingdomId)));
        Continent newContinent = continentRepository.save(new Continent(continent.name(), continent.description(), kingdom));
        kingdom.setContinent(newContinent);
    }
}
