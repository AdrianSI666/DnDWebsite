package com.as.dndwebsite.geographic.plane.continent.region.regionsubspecies;

import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import com.as.dndwebsite.exception.BadRequestException;
import com.as.dndwebsite.exception.NotFoundException;
import com.as.dndwebsite.geographic.plane.continent.region.Region;
import com.as.dndwebsite.geographic.plane.continent.region.RegionRepository;
import com.as.dndwebsite.geographic.plane.continent.region.RegionService;
import com.as.dndwebsite.creatures.types.species.subspecies.SubSpecies;
import com.as.dndwebsite.creatures.types.species.subspecies.SubSpeciesRepository;
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

import static com.as.dndwebsite.creatures.types.species.subspecies.SubSpeciesService.SUB_SPECIES_NOT_FOUND_MSG;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class RegionSubSpeciesService implements IRegionSubSpeciesService {
    private final RegionRepository regionRepository;
    private final SubSpeciesRepository subSpeciesRepository;
    private final DomainMapper<Entry, EntryDTO> mapper;

    @Override
    public Page<EntryDTO> getSubSpeciesRelatedToRegion(String name, PageInfo page) {
        Pageable paging = PageRequest.of(page.number() - 1, page.size(), Sort.by(Sort.Direction.DESC, "id"));
        return subSpeciesRepository.findAllByRegions_Name(name, paging);
    }

    @Override
    public List<EntryDTO> getSubSpeciesRelatedToRegion(Long id) {
        log.info("Getting species related to Region with id {}", id);
        return subSpeciesRepository.findAllByRegions_Id(id);
    }

    @Override
    public void addSubSpeciesRegionRelation(Long subSpeciesId, Long regionId) {
        SubSpecies subspecies = subSpeciesRepository.findById(subSpeciesId).orElseThrow(() -> new NotFoundException(String.format(SUB_SPECIES_NOT_FOUND_MSG, subSpeciesId)));
        Region region = regionRepository.findById(regionId).orElseThrow(() -> new NotFoundException(String.format(RegionService.REGION_NOT_FOUND_MSG, regionId)));
        if(!region.getSubSpecies().add(subspecies)) throw new BadRequestException("Region %s and Sub Species %s are already linked".formatted(region.getName(), subspecies.getName()));
        subspecies.getRegions().add(region);
    }

    @Override
    public void removeSubSpeciesRegionRelation(Long subSpeciesId, Long regionId) {
        SubSpecies subspecies = subSpeciesRepository.findById(subSpeciesId).orElseThrow(() -> new NotFoundException(String.format(SUB_SPECIES_NOT_FOUND_MSG, subSpeciesId)));
        Region region = regionRepository.findById(regionId).orElseThrow(() -> new NotFoundException(String.format(RegionService.REGION_NOT_FOUND_MSG, regionId)));
        region.getSubSpecies().remove(subspecies);
    }

    @Override
    public EntryDTO addNewSubSpeciesToRegion(EntryDTO subSpecies, Long regionId) {
        Region region = regionRepository.findById(regionId).orElseThrow(() -> new NotFoundException(String.format(RegionService.REGION_NOT_FOUND_MSG, regionId)));
        SubSpecies newSubSpecies = subSpeciesRepository.save(new SubSpecies(subSpecies.name(), subSpecies.shortDescription(), region));
        region.getSubSpecies().add(newSubSpecies);
        return mapper.map(newSubSpecies);
    }

    @Override
    public EntryDTO addNewRegionSubSpeciesRelation(EntryDTO region, Long subSpeciesId) {
        SubSpecies subSpecies = subSpeciesRepository.findById(subSpeciesId).orElseThrow(() -> new NotFoundException(String.format(SUB_SPECIES_NOT_FOUND_MSG, subSpeciesId)));
        Region newRegion = regionRepository.save(new Region(region.name(), region.shortDescription(), subSpecies));
        subSpecies.getRegions().add(newRegion);
        return mapper.map(newRegion);
    }

    @Override
    public List<EntryDTO> getRegionsRelatedToSubSpecies(Long id) {
        return regionRepository.findAllBySubSpecies_Id(id);
    }

    @Override
    public Page<EntryDTO> getRegionsRelatedToSubSpecies(String name, PageInfo page) {
        Pageable paging = PageRequest.of(page.number() - 1, page.size(), Sort.by(Sort.Direction.DESC, "id"));
        return regionRepository.findAllBySubSpecies_Name(name, paging);
    }
}
