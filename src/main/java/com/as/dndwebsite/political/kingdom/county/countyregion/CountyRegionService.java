package com.as.dndwebsite.political.kingdom.county.countyregion;

import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import com.as.dndwebsite.exception.BadRequestException;
import com.as.dndwebsite.exception.NotFoundException;
import com.as.dndwebsite.geographic.plane.continent.region.Region;
import com.as.dndwebsite.geographic.plane.continent.region.RegionRepository;
import com.as.dndwebsite.mappers.DomainMapper;
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

import static com.as.dndwebsite.geographic.plane.continent.region.RegionService.REGION_NOT_FOUND_MSG;
import static com.as.dndwebsite.political.kingdom.county.CountyService.COUNTY_NOT_FOUND_MSG;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class CountyRegionService implements ICountyRegionService {
    private final CountyRepository countyRepository;
    private final RegionRepository regionRepository;
    private final DomainMapper<Entry, EntryDTO> mapper;

    @Override
    public List<EntryDTO> getRegionsRelatedToCounty(Long countyId) {
        log.info("Getting regions related to county with id {}", countyId);
        return regionRepository.findAllByCounties_Id(countyId);
    }

    @Override
    public Page<EntryDTO> getRegionsRelatedToCounty(String name, PageInfo page) {
        Pageable paging = PageRequest.of(page.number() - 1, page.size(), Sort.by(Sort.Direction.DESC, "id"));
        return regionRepository.findAllByCounties_Name(name, paging);
    }

    @Override
    public List<EntryDTO> getCountiesRelatedToRegion(String name) {
        return countyRepository.findAllByRegions_Name(name);
    }

    @Override
    public List<EntryDTO> getCountiesOfRegion(Long id) {
        return countyRepository.findAllByRegions_Id(id);
    }

    @Override
    public List<EntryDTO> getAllRegionsWithoutCounty() {
        return regionRepository.findAllByCounties_IdIsNull();
    }

    @Override
    public EntryDTO addNewRegionCountyRelation(Long countyId, EntryDTO region) {
        log.info("Adding region {} to county {}", region.name(), countyId);
        County county = countyRepository.findById(countyId).orElseThrow(() -> new NotFoundException(String.format(COUNTY_NOT_FOUND_MSG, countyId)));
        Region newRegion = regionRepository.save(new Region(region.name(), region.shortDescription(), county));
        county.getRegions().add(newRegion);
        return mapper.map(newRegion);
    }

    @Override
    public EntryDTO addNewCountyRegionRelation(EntryDTO county, Long regionId) {
        Region region = regionRepository.findById(regionId).orElseThrow(() -> new NotFoundException(String.format(REGION_NOT_FOUND_MSG, regionId)));
        County newCounty = countyRepository.save(new County(county.name(), county.shortDescription(), region));
        region.getCounties().add(newCounty);
        return mapper.map(newCounty);
    }

    @Override
    public void addRegionCountyRelation(Long countyId, Long regionId) {
        County county = countyRepository.findById(countyId).orElseThrow(() -> new NotFoundException(String.format(COUNTY_NOT_FOUND_MSG, countyId)));
        Region region = regionRepository.findById(regionId).orElseThrow(() -> new NotFoundException(String.format(REGION_NOT_FOUND_MSG, regionId)));
        if (!county.getRegions().add(region))
            throw new BadRequestException("County %s and Region %s are already linked".formatted(county.getName(), region.getName()));
        region.getCounties().add(county);
    }

    @Override
    public void removeRegionCountyRelation(Long countyId, Long regionId) {
        log.info("Removing region {} from county {}", regionId, countyId);
        County county = countyRepository.findById(countyId).orElseThrow(() -> new NotFoundException(String.format(COUNTY_NOT_FOUND_MSG, countyId)));
        Region region = regionRepository.findById(regionId).orElseThrow(() -> new NotFoundException(String.format(REGION_NOT_FOUND_MSG, regionId)));
        county.getRegions().remove(region);
        region.getCounties().remove(county);
    }

}
