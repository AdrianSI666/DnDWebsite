package com.as.dndwebsite.places.continentkingdom;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import com.as.dndwebsite.exception.NotFoundException;
import com.as.dndwebsite.places.Continent;
import com.as.dndwebsite.places.ContinentRepository;
import com.as.dndwebsite.places.kingdom.Kingdom;
import com.as.dndwebsite.places.kingdom.KingdomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.as.dndwebsite.places.ContinentService.CONTINENT_NOT_FOUND_MSG;
import static com.as.dndwebsite.places.kingdom.KingdomService.KINGDOM_NOT_FOUND_MSG;

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
    public void addNewKingdom(Long continentId, EntryDTO kingdom) {
        log.info("Adding kingdom {} to continent {}", kingdom.name(), continentId);
        Continent continent = continentRepository.findById(continentId).orElseThrow(() -> new NotFoundException(String.format(CONTINENT_NOT_FOUND_MSG, continentId)));
        Kingdom newKingdom = kingdomRepository.save(new Kingdom(kingdom.name(), kingdom.description(), continent));
        continent.getKingdoms().add(newKingdom);
    }

    @Override
    public void removeKingdom(Long continentId, Long kingdomId) {
        log.info("Removing kingdom {} from continent {}", kingdomId, continentId);
        Continent continent = continentRepository.findById(continentId).orElseThrow(() -> new NotFoundException(String.format(CONTINENT_NOT_FOUND_MSG, continentId)));
        Kingdom kingdom = kingdomRepository.findById(kingdomId).orElseThrow(() -> new NotFoundException(String.format(KINGDOM_NOT_FOUND_MSG, kingdomId)));
        continent.getKingdoms().remove(kingdom);
        kingdom.setContinent(null);
    }

    @Override
    public void addKingdom(Long continentId, Long kingdomId) {
        log.info("Adding kingdom {} to continent {}", kingdomId, continentId);
        Continent continent = continentRepository.findById(continentId).orElseThrow(() -> new NotFoundException(String.format(CONTINENT_NOT_FOUND_MSG, continentId)));
        Kingdom kingdom = kingdomRepository.findById(continentId).orElseThrow(() -> new NotFoundException(String.format(KINGDOM_NOT_FOUND_MSG, continentId)));
        continent.getKingdoms().add(kingdom);
        kingdom.setContinent(continent);
    }

    @Override
    public Page<EntryDTO> getKingdomsRelatedToContinent(String name, PageInfo page) {
        Pageable paging = PageRequest.of(page.number() - 1, page.size(), Sort.by(Sort.Direction.DESC, "id"));
        return kingdomRepository.findAllByContinentName(name, paging);
    }
}
