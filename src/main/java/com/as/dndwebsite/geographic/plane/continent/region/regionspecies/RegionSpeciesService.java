package com.as.dndwebsite.geographic.plane.continent.region.regionspecies;

import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import com.as.dndwebsite.exception.BadRequestException;
import com.as.dndwebsite.exception.NotFoundException;
import com.as.dndwebsite.geographic.plane.continent.region.Region;
import com.as.dndwebsite.geographic.plane.continent.region.RegionRepository;
import com.as.dndwebsite.geographic.plane.continent.region.RegionService;
import com.as.dndwebsite.creatures.types.species.Species;
import com.as.dndwebsite.creatures.types.species.SpeciesRepository;
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

import static com.as.dndwebsite.creatures.types.species.SpeciesService.SPECIES_NOT_FOUND_MSG;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class RegionSpeciesService implements IRegionSpeciesService {
    private final RegionRepository regionRepository;
    private final SpeciesRepository speciesRepository;
    private final DomainMapper<Entry, EntryDTO> mapper;
    @Override
    public Page<EntryDTO> getSpeciesRelatedToRegion(String name, PageInfo page) {
        Pageable paging = PageRequest.of(page.number() - 1, page.size(), Sort.by(Sort.Direction.DESC, "id"));
        return speciesRepository.findAllByRegions_Name(name, paging);
    }

    @Override
    public List<EntryDTO> getSpeciesRelatedToRegion(Long id) {
        log.info("Getting speciess related to Region with id {}", id);
        return speciesRepository.findAllByRegions_Id(id);
    }

    @Override
    public void addSpeciesToRegion(Long speciesId, Long regionId) {
        Species species = speciesRepository.findById(speciesId).orElseThrow(() -> new NotFoundException(String.format(SPECIES_NOT_FOUND_MSG, speciesId)));
        Region region = regionRepository.findById(regionId).orElseThrow(() -> new NotFoundException(String.format(RegionService.REGION_NOT_FOUND_MSG, regionId)));
        if(!region.getSpecies().add(species)) throw new BadRequestException("Region %s and Species %s are already linked".formatted(region.getName(), species.getName()));
        species.getRegions().add(region);
    }

    @Override
    public void removeSpeciesFromRegion(Long speciesId, Long regionId) {
        Species species = speciesRepository.findById(speciesId).orElseThrow(() -> new NotFoundException(String.format(SPECIES_NOT_FOUND_MSG, speciesId)));
        Region region = regionRepository.findById(regionId).orElseThrow(() -> new NotFoundException(String.format(RegionService.REGION_NOT_FOUND_MSG, regionId)));
        region.getSpecies().remove(species);
        species.getRegions().remove(region);
    }

    @Override
    public EntryDTO addNewSpeciesToRegion(EntryDTO species, Long regionId) {
        Region region = regionRepository.findById(regionId).orElseThrow(() -> new NotFoundException(String.format(RegionService.REGION_NOT_FOUND_MSG, regionId)));
        Species newSpecies = speciesRepository.save(new Species(species.name(), species.shortDescription(), region));
        region.getSpecies().add(newSpecies);
        return mapper.map(newSpecies);
    }

    @Override
    public List<EntryDTO> getRegionsRelatedToSpecies(Long id) {
        return regionRepository.findAllBySpecies_Id(id);
    }

    @Override
    public Page<EntryDTO> getRegionsRelatedToSpecies(String name, PageInfo page) {
        Pageable paging = PageRequest.of(page.number() - 1, page.size(), Sort.by(Sort.Direction.DESC, "id"));
        return speciesRepository.findAllBySubSpecies_Name(name, paging);
    }

    @Override
    public EntryDTO addNewRegionToSpecies(EntryDTO region, Long speciesId) {
        Species species = speciesRepository.findById(speciesId).orElseThrow(() -> new NotFoundException(String.format(RegionService.REGION_NOT_FOUND_MSG, speciesId)));
        Region newRegion = regionRepository.save(new Region(region.name(), region.shortDescription(), species));
        species.getRegions().add(newRegion);
        return mapper.map(newRegion);
    }
}
