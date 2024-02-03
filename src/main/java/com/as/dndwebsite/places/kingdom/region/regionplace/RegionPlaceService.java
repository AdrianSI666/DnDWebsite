package com.as.dndwebsite.places.kingdom.region.regionplace;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import com.as.dndwebsite.exception.NotFoundException;
import com.as.dndwebsite.places.kingdom.region.Region;
import com.as.dndwebsite.places.kingdom.region.RegionRepository;
import com.as.dndwebsite.places.kingdom.region.place.Place;
import com.as.dndwebsite.places.kingdom.region.place.PlaceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.as.dndwebsite.places.kingdom.region.RegionService.REGION_NOT_FOUND_MSG;
import static com.as.dndwebsite.places.kingdom.region.place.PlaceService.PLACE_NOT_FOUND_MSG;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class RegionPlaceService implements IRegionPlaceService {
    private final PlaceRepository placeRepository;
    private final RegionRepository regionRepository;

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
    public void addPlace(Long regionId, Long placeId) {
        Region region = regionRepository.findById(regionId).orElseThrow(() -> new NotFoundException(String.format(REGION_NOT_FOUND_MSG, regionId)));
        Place place = placeRepository.findById(placeId).orElseThrow(() -> new NotFoundException(String.format(PLACE_NOT_FOUND_MSG, regionId)));
        region.getPlaces().add(place);
        place.setRegion(region);
    }

    @Override
    public void addNewPlaceToRegion(EntryDTO place, Long regionId) {
        log.info("Adding place {} to region {}", place.name(), regionId);
        Region region = regionRepository.findById(regionId).orElseThrow(() -> new NotFoundException(String.format(REGION_NOT_FOUND_MSG, regionId)));
        Place newPlace = placeRepository.save(new Place(place.name(), place.description(), region));
        region.getPlaces().add(newPlace);
    }

    @Override
    public void removePlace(Long regionId, Long placeId) {
        log.info("Removing place {} from region {}", placeId, regionId);
        Region region = regionRepository.findById(regionId).orElseThrow(() -> new NotFoundException(String.format(REGION_NOT_FOUND_MSG, regionId)));
        Place place = placeRepository.findById(placeId).orElseThrow(() -> new NotFoundException(String.format(PLACE_NOT_FOUND_MSG, placeId)));
        region.getPlaces().remove(place);
        place.setRegion(null);
    }


}
