package com.as.dndwebsite.geographic.plane.continent.continentregion;

import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import com.as.dndwebsite.exception.BadRequestException;
import com.as.dndwebsite.exception.NotFoundException;
import com.as.dndwebsite.geographic.plane.continent.Continent;
import com.as.dndwebsite.geographic.plane.continent.ContinentRepository;
import com.as.dndwebsite.geographic.plane.continent.region.Region;
import com.as.dndwebsite.geographic.plane.continent.region.RegionRepository;
import com.as.dndwebsite.geographic.plane.continent.region.RegionService;
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
import java.util.Optional;

import static com.as.dndwebsite.geographic.plane.continent.ContinentService.CONTINENT_NOT_FOUND_MSG;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class ContinentRegionService implements IContinentRegionService {
    private final ContinentRepository continentRepository;
    private final RegionRepository regionRepository;
    private final DomainMapper<Entry, EntryDTO> mapper;
    @Override
    public List<EntryDTO> getRegionsRelatedToContinent(Long continentId) {
        log.info("Getting regions related to continent with id {}", continentId);
        return regionRepository.findAllByContinentId(continentId);
    }

    @Override
    public Page<EntryDTO> getRegionsRelatedToContinent(String name, PageInfo page) {
        Pageable paging = PageRequest.of(page.number() - 1, page.size(), Sort.by(Sort.Direction.DESC, "id"));
        return regionRepository.findAllByContinentName(name, paging);
    }

    @Override
    public EntryDTO getContinentRelatedToRegion(String name) {
        return continentRepository.findByRegions_Name(name).orElseThrow(() -> new NotFoundException(String.format(CONTINENT_NOT_FOUND_MSG, name)));
    }

    @Override
    public Optional<EntryDTO> getContinentOfRegion(Long id) {
        return continentRepository.findByRegions_Id(id);
    }

    @Override
    public List<EntryDTO> getAllRegionsWithoutContinent() {
        return regionRepository.findAllByContinentIdIsNull();
    }

    @Override
    public EntryDTO addNewRegionContinentRelation(Long continentId, EntryDTO region) {
        log.info("Adding region {} to continent {}", region.name(), continentId);
        Continent continent = continentRepository.findById(continentId).orElseThrow(() -> new NotFoundException(String.format(CONTINENT_NOT_FOUND_MSG, continentId)));
        Region newRegion = regionRepository.save(new Region(region.name(), region.shortDescription(), continent));
        continent.getRegions().add(newRegion);
        return mapper.map(newRegion);
    }

    @Override
    public EntryDTO addNewContinentRegionRelation(EntryDTO continent, Long regionId) {
        Region region = regionRepository.findById(regionId).orElseThrow(() -> new NotFoundException(String.format(RegionService.REGION_NOT_FOUND_MSG, regionId)));
        Continent newContinent = continentRepository.save(new Continent(continent.name(), continent.shortDescription(), region));
        region.setContinent(newContinent);
        return mapper.map(newContinent);
    }

    @Override
    public void addRegionContinentRelation(Long continentId, Long regionId) {
        Continent continent = continentRepository.findById(continentId).orElseThrow(() -> new NotFoundException(String.format(CONTINENT_NOT_FOUND_MSG, continentId)));
        Region region = regionRepository.findById(regionId).orElseThrow(() -> new NotFoundException(String.format(RegionService.REGION_NOT_FOUND_MSG, regionId)));
        if(!continent.getRegions().add(region)) throw new BadRequestException("Continent %s and Region %s are already linked".formatted(continent.getName(), region.getName()));
        region.setContinent(continent);
    }

    @Override
    public void removeRegionContinentRelation(Long continentId, Long regionId) {
        log.info("Removing region {} from continent {}", regionId, continentId);
        Continent continent = continentRepository.findById(continentId).orElseThrow(() -> new NotFoundException(String.format(CONTINENT_NOT_FOUND_MSG, continentId)));
        Region region = regionRepository.findById(regionId).orElseThrow(() -> new NotFoundException(String.format(RegionService.REGION_NOT_FOUND_MSG, regionId)));
        continent.getRegions().remove(region);
        region.setContinent(null);
    }

}
