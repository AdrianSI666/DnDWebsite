package com.as.dndwebsite.geographic.plane.continent.region;

import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import com.as.dndwebsite.exception.NotFoundException;
import com.as.dndwebsite.mappers.DescriptionMapper;
import com.as.dndwebsite.mappers.DomainMapper;
import com.as.dndwebsite.mappers.ImageMapper;
import com.as.dndwebsite.security.OwningSecurityFunctions;
import com.as.dndwebsite.world.World;
import com.as.dndwebsite.world.WorldRepository;
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

import static com.as.dndwebsite.world.WorldService.WORLD_NOT_FOUND_MSG;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class RegionService implements IRegionService {
    private final RegionRepository regionRepository;
    private final WorldRepository worldRepository;
    private final DomainMapper<Entry, EntryDTO> mapper;
    private final DescriptionMapper descriptionMapper;
    private final ImageMapper imageMapper;
    public static final String REGION_NOT_FOUND_MSG =
            "Region with name %s not found";
    private final OwningSecurityFunctions owningSecurityFunctions;
    @Override
    public Page<EntryDTO> getRegions(PageInfo page) {
        log.debug("Getting Regions");
        Pageable paging = PageRequest.of(page.number() - 1, page.size(), Sort.by(Sort.Direction.DESC, "id"));
        Page<Region> regionPage = regionRepository.findAll(paging);
        return regionPage.map(mapper::map);
    }

    @Override
    public RegionDTO getRegion(String name) {
        log.debug("Getting Region");
        Region region = regionRepository.findByName(name).orElseThrow(
                () -> new NotFoundException(String.format(REGION_NOT_FOUND_MSG, name)));
        Optional<EntryDTO> continent = Optional.empty();
        if (region.getContinent() != null) continent = Optional.of(mapper.map(region.getContinent()));
        return new RegionDTO(mapper.map(region),
                continent,
                region.getPlaces().stream().map(mapper::map).toList(),
                region.getDescriptions().stream().map(descriptionMapper::map).toList(),
                region.getImages().stream().map(imageMapper::map).toList(),
                region.getCultures().stream().map(mapper::map).toList(),
                region.getSpecies().stream().map(mapper::map).toList(),
                region.getSubSpecies().stream().map(mapper::map).toList(),
                region.getCounties().stream().map(mapper::map).toList());
    }

    @Override
    public EntryDTO saveRegion(EntryDTO region, Long worldId) {
        log.debug("Saving new Region {}", region.name());
        World world = worldRepository.findById(worldId).orElseThrow(
                () -> new NotFoundException(String.format(WORLD_NOT_FOUND_MSG, worldId)));
        owningSecurityFunctions.checkIfLoggedInUserIsTheSameAsAuthor(world.getAuthor(), "Save new region", world.getId());
        return mapper.map(regionRepository.save(new Region(region.name(), region.shortDescription(), world)));
    }

    @Override
    public void updateRegion(EntryDTO region, Long id) {
        Region oldRegion = regionRepository.findById(id).orElseThrow(() -> new NotFoundException(String.format(REGION_NOT_FOUND_MSG, id)));
        log.debug("Updating Region: {}", oldRegion.getName());
        owningSecurityFunctions.checkIfLoggedInUserIsTheSameAsAuthor(oldRegion.getWorld().getAuthor(), "Update region", oldRegion.getId());
        oldRegion.setName(region.name());
        oldRegion.setShortDescription(region.shortDescription());
    }

    @Override
    public void deleteRegion(Long id) {
        log.debug("Deleting region with id: {}", id);
        Region region = regionRepository.findById(id).orElseThrow(() -> new NotFoundException(String.format(REGION_NOT_FOUND_MSG, id)));
        owningSecurityFunctions.checkIfLoggedInUserIsTheSameAsAuthor(region.getWorld().getAuthor(), "Delete region", region.getId());
        regionRepository.delete(region);
    }

    @Override
    public List<EntryDTO> getAllRegions() {
        return regionRepository.findAll().stream().map(mapper::map).toList();
    }

}
