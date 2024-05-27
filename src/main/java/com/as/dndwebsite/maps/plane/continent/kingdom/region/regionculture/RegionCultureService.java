package com.as.dndwebsite.maps.plane.continent.kingdom.region.regionculture;

import com.as.dndwebsite.culture.Culture;
import com.as.dndwebsite.culture.CultureRepository;
import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import com.as.dndwebsite.exception.BadRequestException;
import com.as.dndwebsite.exception.NotFoundException;
import com.as.dndwebsite.maps.plane.continent.kingdom.region.Region;
import com.as.dndwebsite.maps.plane.continent.kingdom.region.RegionRepository;
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

import static com.as.dndwebsite.culture.CultureService.CULTURE_NOT_FOUND_MSG;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class RegionCultureService implements IRegionCultureService {
    private final RegionRepository regionRepository;
    private final CultureRepository cultureRepository;
    private final DomainMapper<Entry, EntryDTO> mapper;
    @Override
    public List<EntryDTO> getCulturesRelatedToRegion(Long regionId){
        return cultureRepository.findAllByRegions_Id(regionId);
    }
    @Override
    public Page<EntryDTO> getCulturesRelatedToRegion(String name, PageInfo page) {
        Pageable paging = PageRequest.of(page.number() - 1, page.size(), Sort.by(Sort.Direction.DESC, "id"));
        return cultureRepository.findAllByRegions_Name(name, paging);
    }

    @Override
    public List<EntryDTO> getRegionsRelatedToCulture(Long regionId){
        return regionRepository.findAllByCultures_Id(regionId);
    }

    @Override
    public Page<EntryDTO> getRegionsRelatedToCulture(String name, PageInfo page) {
        Pageable paging = PageRequest.of(page.number() - 1, page.size(), Sort.by(Sort.Direction.DESC, "id"));
        return regionRepository.findAllByCultures_Name(name, paging);
    }

    @Override
    public EntryDTO addNewRegionToCultureRelation(EntryDTO region, Long cultureId) {
        Culture culture = cultureRepository.findById(cultureId).orElseThrow(() -> new NotFoundException(String.format(CULTURE_NOT_FOUND_MSG, cultureId)));
        Region newRegion = regionRepository.save(new Region(region.name(), region.description(), culture));
        culture.getRegions().add(newRegion);
        return mapper.map(newRegion);
    }

    @Override
    public EntryDTO addNewCultureToRegionRelation(EntryDTO culture, Long regionId) {
        Region region = regionRepository.findById(regionId).orElseThrow(() -> new NotFoundException(String.format(RegionService.REGION_NOT_FOUND_MSG, regionId)));
        Culture newCulture = cultureRepository.save(new Culture(culture.name(), culture.description(), region));
        region.getCultures().add(newCulture);
        return mapper.map(newCulture);
    }

    @Override
    public void addCultureRegionRelation(Long cultureId, Long regionId) {
        Culture culture = cultureRepository.findById(cultureId).orElseThrow(() -> new NotFoundException(String.format(CULTURE_NOT_FOUND_MSG, cultureId)));
        Region region = regionRepository.findById(regionId).orElseThrow(() -> new NotFoundException(String.format(RegionService.REGION_NOT_FOUND_MSG, regionId)));
        if(!region.getCultures().add(culture)) throw new BadRequestException("Region %s and Culture %s are already linked".formatted(region.getName(), culture.getName()));
        culture.getRegions().add(region);
    }

    @Override
    public void removeCultureRegionRelation(Long cultureId, Long regionId) {
        Culture culture = cultureRepository.findById(cultureId).orElseThrow(() -> new NotFoundException(String.format(CULTURE_NOT_FOUND_MSG, cultureId)));
        Region region = regionRepository.findById(regionId).orElseThrow(() -> new NotFoundException(String.format(RegionService.REGION_NOT_FOUND_MSG, regionId)));
        region.getCultures().remove(culture);
        culture.getRegions().remove(region);
    }


}
