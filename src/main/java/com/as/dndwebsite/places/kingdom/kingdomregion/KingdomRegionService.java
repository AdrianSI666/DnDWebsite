package com.as.dndwebsite.places.kingdom.kingdomregion;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import com.as.dndwebsite.exception.NotFoundException;
import com.as.dndwebsite.places.kingdom.Kingdom;
import com.as.dndwebsite.places.kingdom.KingdomRepository;
import com.as.dndwebsite.places.kingdom.region.Region;
import com.as.dndwebsite.places.kingdom.region.RegionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.as.dndwebsite.places.kingdom.KingdomService.KINGDOM_NOT_FOUND_MSG;
import static com.as.dndwebsite.places.kingdom.region.RegionService.REGION_NOT_FOUND_MSG;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class KingdomRegionService implements IKingdomRegionService {
    private final KingdomRepository kingdomRepository;
    private final RegionRepository regionRepository;
    @Override
    public void addNewRegion(Long kingdomId, EntryDTO region) {
        log.info("Adding region {} to kingdom {}", region.name(), kingdomId);
        Kingdom kingdom = kingdomRepository.findById(kingdomId).orElseThrow(() -> new NotFoundException(String.format(KINGDOM_NOT_FOUND_MSG, kingdomId)));
        Region newRegion = regionRepository.save(new Region(region.name(), region.description(), kingdom));
        kingdom.getRegions().add(newRegion);
    }

    @Override
    public void removeRegion(Long kingdomId, Long regionId) {
        log.info("Removing region {} from kingdom {}", regionId, kingdomId);
        Kingdom kingdom = kingdomRepository.findById(kingdomId).orElseThrow(() -> new NotFoundException(String.format(KINGDOM_NOT_FOUND_MSG, kingdomId)));
        Region region = regionRepository.findById(regionId).orElseThrow(() -> new NotFoundException(String.format(REGION_NOT_FOUND_MSG, regionId)));
        kingdom.getRegions().remove(region);
        region.setKingdom(null);
    }

    @Override
    public List<EntryDTO> getRegionsRelatedToKingdom(Long kingdomId) {
        log.info("Getting regions related to kingdom with id {}", kingdomId);
        return regionRepository.findAllByKingdomId(kingdomId);
    }

    @Override
    public Page<EntryDTO> getRegionsRelatedToKingdom(String name, PageInfo page) {
        Pageable paging = PageRequest.of(page.number() - 1, page.size(), Sort.by(Sort.Direction.DESC, "id"));
        return regionRepository.findAllByKingdomName(name, paging);
    }

    @Override
    public void addRegion(Long kingdomId, Long regionId) {
        Kingdom kingdom = kingdomRepository.findById(kingdomId).orElseThrow(() -> new NotFoundException(String.format(KINGDOM_NOT_FOUND_MSG, kingdomId)));
        Region region = regionRepository.findById(regionId).orElseThrow(() -> new NotFoundException(String.format(REGION_NOT_FOUND_MSG, regionId)));
        kingdom.getRegions().add(region);
        region.setKingdom(kingdom);
    }
}
