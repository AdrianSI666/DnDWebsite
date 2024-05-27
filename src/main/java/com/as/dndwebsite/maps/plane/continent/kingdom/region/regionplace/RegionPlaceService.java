package com.as.dndwebsite.maps.plane.continent.kingdom.region.regionplace;

import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import com.as.dndwebsite.exception.BadRequestException;
import com.as.dndwebsite.exception.NotFoundException;
import com.as.dndwebsite.maps.plane.continent.kingdom.region.Region;
import com.as.dndwebsite.maps.plane.continent.kingdom.region.RegionRepository;
import com.as.dndwebsite.maps.plane.continent.kingdom.region.place.Place;
import com.as.dndwebsite.maps.plane.continent.kingdom.region.place.PlaceRepository;
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
import java.util.Optional;

import static com.as.dndwebsite.maps.plane.continent.kingdom.region.place.PlaceService.PLACE_NOT_FOUND_MSG;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class RegionPlaceService implements IRegionPlaceService {
    private final PlaceRepository placeRepository;
    private final RegionRepository regionRepository;
    private final DomainMapper<Entry, EntryDTO> mapper;

    @Override
    public Page<EntryDTO> getPlacesRelatedToRegion(String name, PageInfo page) {
        Pageable paging = PageRequest.of(page.number() - 1, page.size(), Sort.by(Sort.Direction.DESC, "id"));
        return placeRepository.findAllByRegionName(name, paging);
    }

    @Override
    public List<EntryDTO> getPlacesRelatedToRegion(Long id) {
        log.info("Getting regions related to kingdom with id {}", id);
        return placeRepository.findAllByRegionId(id);
    }

    @Override
    public EntryDTO getRegionRelatedToPlace(String name) {
        return regionRepository.findAllByPlaces_Name(name).orElseThrow(() -> new NotFoundException(String.format(RegionService.REGION_NOT_FOUND_MSG, name)));
    }

    @Override
    public Optional<EntryDTO> getRegionRelatedToPlace(Long id) {
        return regionRepository.findByPlaces_Id(id);
    }

    @Override
    public List<EntryDTO> getAllPlacesWithoutRegion() {
        return placeRepository.findAllByRegionIdIsNull();
    }

    @Override
    public EntryDTO addNewRegionToPlaceRelation(EntryDTO region, Long placeId) {
        Place place = placeRepository.findById(placeId).orElseThrow(() -> new NotFoundException(String.format(PLACE_NOT_FOUND_MSG, placeId)));
        Region newRegion = regionRepository.save(new Region(region.name(), region.description(), place));
        place.setRegion(newRegion);
        return mapper.map(newRegion);
    }

    @Override
    public EntryDTO addNewPlaceToRegionRelation(EntryDTO place, Long regionId) {
        log.info("Adding place {} to region {}", place.name(), regionId);
        Region region = regionRepository.findById(regionId).orElseThrow(() -> new NotFoundException(String.format(RegionService.REGION_NOT_FOUND_MSG, regionId)));
        Place newPlace = placeRepository.save(new Place(place.name(), place.description(), region));
        region.getPlaces().add(newPlace);
        return mapper.map(newPlace);
    }

    @Override
    public void addPlaceRegionRelation(Long regionId, Long placeId) {
        Region region = regionRepository.findById(regionId).orElseThrow(() -> new NotFoundException(String.format(RegionService.REGION_NOT_FOUND_MSG, regionId)));
        Place place = placeRepository.findById(placeId).orElseThrow(() -> new NotFoundException(String.format(PLACE_NOT_FOUND_MSG, regionId)));
        if(!region.getPlaces().add(place)) throw new BadRequestException("Region %s and Place %s are already linked".formatted(region.getName(), place.getName()));
        place.setRegion(region);
    }

    @Override
    public void removePlaceRegionRelation(Long regionId, Long placeId) {
        log.info("Removing place {} from region {}", placeId, regionId);
        Region region = regionRepository.findById(regionId).orElseThrow(() -> new NotFoundException(String.format(RegionService.REGION_NOT_FOUND_MSG, regionId)));
        Place place = placeRepository.findById(placeId).orElseThrow(() -> new NotFoundException(String.format(PLACE_NOT_FOUND_MSG, placeId)));
        region.getPlaces().remove(place);
        place.setRegion(null);
    }

}
