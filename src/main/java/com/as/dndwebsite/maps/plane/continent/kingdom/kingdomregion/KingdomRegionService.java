package com.as.dndwebsite.maps.plane.continent.kingdom.kingdomregion;

import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import com.as.dndwebsite.exception.BadRequestException;
import com.as.dndwebsite.exception.NotFoundException;
import com.as.dndwebsite.maps.plane.continent.kingdom.Kingdom;
import com.as.dndwebsite.maps.plane.continent.kingdom.KingdomRepository;
import com.as.dndwebsite.maps.plane.continent.kingdom.region.Region;
import com.as.dndwebsite.maps.plane.continent.kingdom.region.RegionRepository;
import com.as.dndwebsite.maps.plane.continent.kingdom.KingdomService;
import com.as.dndwebsite.maps.plane.continent.kingdom.region.RegionService;
import com.as.dndwebsite.util.DomainMapper;
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
public class KingdomRegionService implements IKingdomRegionService {
    private final KingdomRepository kingdomRepository;
    private final RegionRepository regionRepository;
    private final DomainMapper<Entry, EntryDTO> mapper;
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
    public EntryDTO getKingdomRelatedToRegion(String name) {
        return kingdomRepository.findByRegions_Name(name).orElseThrow(() -> new NotFoundException(String.format(KingdomService.KINGDOM_NOT_FOUND_MSG, name)));
    }

    @Override
    public EntryDTO getKingdomOfRegion(Long id) {
        return kingdomRepository.findByRegions_Id(id).orElseThrow(() -> new NotFoundException(String.format(KingdomService.KINGDOM_NOT_FOUND_MSG, id)));
    }

    @Override
    public List<EntryDTO> getAllRegionsWithoutKingdom() {
        return regionRepository.findAllByKingdomIdIsNull();
    }

    @Override
    public EntryDTO addNewRegionKingdomRelation(Long kingdomId, EntryDTO region) {
        log.info("Adding region {} to kingdom {}", region.name(), kingdomId);
        Kingdom kingdom = kingdomRepository.findById(kingdomId).orElseThrow(() -> new NotFoundException(String.format(KingdomService.KINGDOM_NOT_FOUND_MSG, kingdomId)));
        Region newRegion = regionRepository.save(new Region(region.name(), region.description(), kingdom));
        kingdom.getRegions().add(newRegion);
        return mapper.map(newRegion);
    }

    @Override
    public EntryDTO addNewKingdomRegionRelation(EntryDTO kingdom, Long regionId) {
        Region region = regionRepository.findById(regionId).orElseThrow(() -> new NotFoundException(String.format(RegionService.REGION_NOT_FOUND_MSG, regionId)));
        Kingdom newKingdom = kingdomRepository.save(new Kingdom(kingdom.name(), kingdom.description(), region));
        region.setKingdom(newKingdom);
        return mapper.map(newKingdom);
    }

    @Override
    public void addRegionKingdomRelation(Long kingdomId, Long regionId) {
        Kingdom kingdom = kingdomRepository.findById(kingdomId).orElseThrow(() -> new NotFoundException(String.format(KingdomService.KINGDOM_NOT_FOUND_MSG, kingdomId)));
        Region region = regionRepository.findById(regionId).orElseThrow(() -> new NotFoundException(String.format(RegionService.REGION_NOT_FOUND_MSG, regionId)));
        if(!kingdom.getRegions().add(region)) throw new BadRequestException("Kingdom %s and Region %s are already linked".formatted(kingdom.getName(), region.getName()));
        region.setKingdom(kingdom);
    }

    @Override
    public void removeRegionKingdomRelation(Long kingdomId, Long regionId) {
        log.info("Removing region {} from kingdom {}", regionId, kingdomId);
        Kingdom kingdom = kingdomRepository.findById(kingdomId).orElseThrow(() -> new NotFoundException(String.format(KingdomService.KINGDOM_NOT_FOUND_MSG, kingdomId)));
        Region region = regionRepository.findById(regionId).orElseThrow(() -> new NotFoundException(String.format(RegionService.REGION_NOT_FOUND_MSG, regionId)));
        kingdom.getRegions().remove(region);
        region.setKingdom(null);
    }

}
