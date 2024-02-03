package com.as.dndwebsite.places.kingdom.region.regionculture;

import com.as.dndwebsite.culture.Culture;
import com.as.dndwebsite.culture.CultureRepository;
import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import com.as.dndwebsite.exception.NotFoundException;
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

import static com.as.dndwebsite.culture.CultureService.CULTURE_NOT_FOUND_MSG;
import static com.as.dndwebsite.places.kingdom.region.RegionService.REGION_NOT_FOUND_MSG;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class RegionCultureService implements IRegionCultureService {
    private final RegionRepository regionRepository;
    private final CultureRepository cultureRepository;
    @Override
    public Page<EntryDTO> getCulturesRelatedToRegion(String name, PageInfo page) {
        Pageable paging = PageRequest.of(page.number() - 1, page.size(), Sort.by(Sort.Direction.DESC, "id"));
        return cultureRepository.findAllByRegions_Name(name, paging);
    }
    @Override
    public List<EntryDTO> getCulturesRelatedToRegion(Long regionId){
        return cultureRepository.findAllByRegions_Id(regionId);
    }

    @Override
    public void addCultureToRegion(Long cultureId, Long regionId) {
        Culture culture = cultureRepository.findById(cultureId).orElseThrow(() -> new NotFoundException(String.format(CULTURE_NOT_FOUND_MSG, regionId)));
        Region region = regionRepository.findById(regionId).orElseThrow(() -> new NotFoundException(String.format(REGION_NOT_FOUND_MSG, regionId)));
        region.getCultures().add(culture);
        culture.getRegions().add(region);
    }

    @Override
    public void addNewCultureToRegion(EntryDTO culture, Long regionId) {
        Region region = regionRepository.findById(regionId).orElseThrow(() -> new NotFoundException(String.format(REGION_NOT_FOUND_MSG, regionId)));
        Culture newCulture = cultureRepository.save(new Culture(culture.name(), culture.description(), region));
        region.getCultures().add(newCulture);
    }

    @Override
    public void removeCultureFromRegion(Long cultureId, Long regionId) {
        Culture culture = cultureRepository.findById(cultureId).orElseThrow(() -> new NotFoundException(String.format(CULTURE_NOT_FOUND_MSG, regionId)));
        Region region = regionRepository.findById(regionId).orElseThrow(() -> new NotFoundException(String.format(REGION_NOT_FOUND_MSG, regionId)));
        region.getCultures().remove(culture);
        culture.getRegions().remove(region);
    }
}
