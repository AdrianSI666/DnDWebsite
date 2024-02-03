package com.as.dndwebsite.places.kingdom.region.regionkingdom;

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

import static com.as.dndwebsite.places.kingdom.KingdomService.KINGDOM_NOT_FOUND_MSG;
import static com.as.dndwebsite.places.kingdom.region.RegionService.REGION_NOT_FOUND_MSG;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class RegionKingdomService implements IRegionKingdomService {
    private final KingdomRepository kingdomRepository;
    private final RegionRepository regionRepository;

    @Override
    public Page<EntryDTO> getRegionsRelatedToKingdom(String name, PageInfo page) {
        Pageable paging = PageRequest.of(page.number() - 1, page.size(), Sort.by(Sort.Direction.DESC, "id"));
        return regionRepository.findAllByKingdomName(name, paging);
    }

    @Override
    public EntryDTO getKingdomOfRegion(Long id) {
        return kingdomRepository.findByRegions_Id(id).orElseThrow(() -> new NotFoundException(String.format(KINGDOM_NOT_FOUND_MSG, id)));
    }

    @Override
    public void setKingdomToRegion(Long kingdomId, Long regionId) {
        log.info("Adding region {} to kingdom {}", regionId, kingdomId);
        Kingdom kingdom = kingdomRepository.findById(kingdomId).orElseThrow(() -> new NotFoundException(String.format(KINGDOM_NOT_FOUND_MSG, kingdomId)));
        Region region = regionRepository.findById(regionId).orElseThrow(() -> new NotFoundException(String.format(REGION_NOT_FOUND_MSG, regionId)));
        region.setKingdom(kingdom);
        kingdom.getRegions().add(region);
    }

    @Override
    public void removeKingdomFromRegion(Long kingdomId, Long regionId) {
        Kingdom kingdom = kingdomRepository.findById(kingdomId).orElseThrow(() -> new NotFoundException(String.format(KINGDOM_NOT_FOUND_MSG, kingdomId)));
        Region region = regionRepository.findById(regionId).orElseThrow(() -> new NotFoundException(String.format(REGION_NOT_FOUND_MSG, regionId)));
        region.setKingdom(null);
        kingdom.getRegions().remove(region);
    }

    @Override
    public void addNewKingdomToRegion(EntryDTO kingdom, Long regionId) {
        Region region = regionRepository.findById(regionId).orElseThrow(() -> new NotFoundException(String.format(REGION_NOT_FOUND_MSG, regionId)));
        Kingdom newKingdom = kingdomRepository.save(new Kingdom(kingdom.name(), kingdom.description(), region));
        region.setKingdom(newKingdom);
    }
}
