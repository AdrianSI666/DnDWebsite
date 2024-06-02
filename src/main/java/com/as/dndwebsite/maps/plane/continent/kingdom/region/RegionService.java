package com.as.dndwebsite.maps.plane.continent.kingdom.region;

import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import com.as.dndwebsite.exception.NotFoundException;
import com.as.dndwebsite.mappers.DomainMapper;
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
public class RegionService implements IRegionService {
    private final RegionRepository regionRepository;
    private final DomainMapper<Entry, EntryDTO> mapper;
    public static final String REGION_NOT_FOUND_MSG =
            "Region with name %s not found";

    @Override
    public Page<EntryDTO> getRegions(PageInfo page) {
        log.info("Getting Regions");
        Pageable paging = PageRequest.of(page.number() - 1, page.size(), Sort.by(Sort.Direction.DESC, "id"));
        Page<Region> regionPage = regionRepository.findAll(paging);
        return regionPage.map(mapper::map);
    }

    @Override
    public EntryDTO getRegion(String name) {
        log.info("Getting Region");
        return regionRepository.findByName(name).orElseThrow(
                () -> new NotFoundException(String.format(REGION_NOT_FOUND_MSG, name)));
    }

    @Override
    public EntryDTO saveRegion(EntryDTO region) {
        log.info("Saving new Region {}", region.name());
        return mapper.map(regionRepository.save(new Region(region.name(), region.shortDescription())));
    }

    @Override
    public void updateRegion(EntryDTO region, Long id) {
        Region oldRegion = regionRepository.findById(id).orElseThrow(() -> new NotFoundException(String.format(REGION_NOT_FOUND_MSG, id)));
        log.info("Updating Region: " + oldRegion.getName());
        oldRegion.setName(region.name());
        oldRegion.setShortDescription(region.shortDescription());
    }

    @Override
    public void deleteRegion(Long id) {
        log.info("Deleting region with id: " + id);
        regionRepository.deleteById(id);
    }

    @Override
    public List<EntryDTO> getAllRegions() {
        return regionRepository.findAll().stream().map(mapper::map).toList();
    }

}
