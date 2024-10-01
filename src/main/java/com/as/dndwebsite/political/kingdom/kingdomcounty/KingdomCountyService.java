package com.as.dndwebsite.political.kingdom.kingdomcounty;

import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import com.as.dndwebsite.exception.BadRequestException;
import com.as.dndwebsite.exception.NotFoundException;
import com.as.dndwebsite.mappers.DomainMapper;
import com.as.dndwebsite.political.kingdom.Kingdom;
import com.as.dndwebsite.political.kingdom.KingdomRepository;
import com.as.dndwebsite.political.kingdom.county.County;
import com.as.dndwebsite.political.kingdom.county.CountyRepository;
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

import static com.as.dndwebsite.political.kingdom.KingdomService.KINGDOM_NOT_FOUND_MSG;
import static com.as.dndwebsite.political.kingdom.county.CountyService.COUNTY_NOT_FOUND_MSG;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class KingdomCountyService implements IKingdomCountyService {
    private final KingdomRepository kingdomRepository;
    private final CountyRepository countyRepository;
    private final DomainMapper<Entry, EntryDTO> mapper;

    @Override
    public List<EntryDTO> getCountiesRelatedToKingdom(Long kingdomId) {
        log.debug("Getting counties related to kingdom with id {}", kingdomId);
        return countyRepository.findAllByKingdomId(kingdomId);
    }

    @Override
    public Page<EntryDTO> getCountiesRelatedToKingdom(String name, PageInfo page) {
        Pageable paging = PageRequest.of(page.number() - 1, page.size(), Sort.by(Sort.Direction.DESC, "id"));
        return countyRepository.findAllByKingdomName(name, paging);
    }

    @Override
    public EntryDTO getKingdomOfCounty(String name) {
        return kingdomRepository.findByCounties_Name(name).orElseThrow(() -> new NotFoundException(String.format(KINGDOM_NOT_FOUND_MSG, name)));
    }

    @Override
    public Optional<EntryDTO> getKingdomOfCounty(Long id) {
        return kingdomRepository.findByCounties_Id(id);
    }

    @Override
    public EntryDTO addNewCountyKingdomRelation(Long kingdomId, EntryDTO county) {
        log.debug("Adding new county {} to kingdom {}", county.name(), kingdomId);
        Kingdom kingdom = kingdomRepository.findById(kingdomId).orElseThrow(() -> new NotFoundException(String.format(KINGDOM_NOT_FOUND_MSG, kingdomId)));
        County newCounty = countyRepository.save(new County(county.name(), county.shortDescription(), kingdom));
        kingdom.getCounties().add(newCounty);
        return mapper.map(newCounty);
    }

    @Override
    public void removeCountyKingdomRelation(Long kingdomId, Long countyId) {
        log.debug("Removing county {} from kingdom {}", countyId, kingdomId);
        Kingdom kingdom = kingdomRepository.findById(kingdomId).orElseThrow(() -> new NotFoundException(String.format(KINGDOM_NOT_FOUND_MSG, kingdomId)));
        County county = countyRepository.findById(countyId).orElseThrow(() -> new NotFoundException(String.format(COUNTY_NOT_FOUND_MSG, countyId)));
        kingdom.getCounties().remove(county);
        county.setKingdom(null);
    }

    @Override
    public void addCountyKingdomRelation(Long kingdomId, Long countyId) {
        log.debug("Adding county {} to kingdom {}", countyId, kingdomId);
        Kingdom kingdom = kingdomRepository.findById(kingdomId).orElseThrow(() -> new NotFoundException(String.format(KINGDOM_NOT_FOUND_MSG, kingdomId)));
        County county = countyRepository.findById(countyId).orElseThrow(() -> new NotFoundException(String.format(COUNTY_NOT_FOUND_MSG, countyId)));
        if(!kingdom.getCounties().add(county)) throw new BadRequestException("Kingdom %s and County %s are already linked".formatted(kingdom.getName(), county.getName()));
        county.setKingdom(kingdom);
    }


    @Override
    public EntryDTO addNewKingdomCountyRelation(Long countyId, EntryDTO kingdom) {
        log.debug("Setting new kingdom {} to county {}", kingdom.name(), countyId);
        County county = countyRepository.findById(countyId).orElseThrow(() -> new NotFoundException(String.format(COUNTY_NOT_FOUND_MSG, countyId)));
        Kingdom newKingdom = kingdomRepository.save(new Kingdom(kingdom.name(), kingdom.shortDescription(), county));
        county.setKingdom(newKingdom);
        return mapper.map(newKingdom);
    }

    @Override
    public List<EntryDTO> getAllCountiesWithoutKingdom() {
        return countyRepository.findAllByKingdomIdIsNull();
    }
}
