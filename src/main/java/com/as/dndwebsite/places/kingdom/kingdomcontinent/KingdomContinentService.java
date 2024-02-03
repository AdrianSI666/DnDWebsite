package com.as.dndwebsite.places.kingdom.kingdomcontinent;

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

import static com.as.dndwebsite.places.ContinentService.CONTINENT_NOT_FOUND_MSG;
import static com.as.dndwebsite.places.kingdom.KingdomService.KINGDOM_NOT_FOUND_MSG;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class KingdomContinentService implements IKingdomContinentService {
    private final ContinentRepository continentRepository;
    private final KingdomRepository kingdomRepository;
    @Override
    public Page<EntryDTO> getKingdomsRelatedToContinent(String name, PageInfo page) {
        Pageable paging = PageRequest.of(page.number() - 1, page.size(), Sort.by(Sort.Direction.DESC, "id"));
        return kingdomRepository.findAllByContinentName(name, paging);
    }

    @Override
    public EntryDTO getContinentOfKingdom(long id){
        return continentRepository.findByKingdoms_Id(id).orElseThrow(() -> new NotFoundException(String.format(CONTINENT_NOT_FOUND_MSG, id)));
    }

    @Override
    public void setContinent(Long kingdomId, Long continentId) {
        Kingdom kingdom = kingdomRepository.findById(kingdomId).orElseThrow(() -> new NotFoundException(String.format(KINGDOM_NOT_FOUND_MSG, kingdomId)));
        Continent continent = continentRepository.findById(continentId).orElseThrow(() -> new NotFoundException(String.format(CONTINENT_NOT_FOUND_MSG, kingdomId)));
        kingdom.setContinent(continent);
        continent.getKingdoms().add(kingdom);
    }

    @Override
    public void removeContinent(Long kingdomId, Long continentId) {
        Kingdom kingdom = kingdomRepository.findById(kingdomId).orElseThrow(() -> new NotFoundException(String.format(KINGDOM_NOT_FOUND_MSG, kingdomId)));
        Continent continent = continentRepository.findById(continentId).orElseThrow(() -> new NotFoundException(String.format(CONTINENT_NOT_FOUND_MSG, kingdomId)));
        kingdom.setContinent(null);
        continent.getKingdoms().remove(kingdom);
    }

    @Override
    public void addNewContinent(Long kingdomId, EntryDTO continent) {
        Kingdom kingdom = kingdomRepository.findById(kingdomId).orElseThrow(() -> new NotFoundException(String.format(KINGDOM_NOT_FOUND_MSG, kingdomId)));
        Continent newContinent = continentRepository.save(new Continent(continent.name(), continent.description(), kingdom));
        kingdom.setContinent(newContinent);
    }
}
