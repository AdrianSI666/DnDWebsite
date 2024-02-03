package com.as.dndwebsite.places.kingdom.region.place.placeregion;

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

import static com.as.dndwebsite.places.kingdom.region.RegionService.REGION_NOT_FOUND_MSG;
import static com.as.dndwebsite.places.kingdom.region.place.PlaceService.PLACE_NOT_FOUND_MSG;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class PlaceRegionService implements IPlaceRegionService {
    private final PlaceRepository placeRepository;
    private final RegionRepository regionRepository;

    @Override
    public Page<EntryDTO> getPlacesRelatedToRegion(String name, PageInfo page) {
        Pageable paging = PageRequest.of(page.number() - 1, page.size(), Sort.by(Sort.Direction.DESC, "id"));
        return placeRepository.findAllByRegionName(name, paging);
    }

    @Override
    public EntryDTO getRegionOfPlace(Long id) {
        return regionRepository.findByPlaces_Id(id).orElseThrow(() -> new NotFoundException(String.format(REGION_NOT_FOUND_MSG, id)));
    }

    @Override
    public void setPlaceOfRegion(Long regionId, Long placeId) {
        log.info("Adding place {} to region {}", placeId, regionId);
        Region region = regionRepository.findById(regionId).orElseThrow(() -> new NotFoundException(String.format(REGION_NOT_FOUND_MSG, regionId)));
        Place place = placeRepository.findById(placeId).orElseThrow(() -> new NotFoundException(String.format(PLACE_NOT_FOUND_MSG, regionId)));
        place.setRegion(region);
        region.getPlaces().add(place);
    }

    @Override
    public void removePlaceOfRegion(Long regionId, Long placeId) {
        Region region = regionRepository.findById(regionId).orElseThrow(() -> new NotFoundException(String.format(REGION_NOT_FOUND_MSG, regionId)));
        Place place = placeRepository.findById(placeId).orElseThrow(() -> new NotFoundException(String.format(PLACE_NOT_FOUND_MSG, regionId)));
        place.setRegion(null);
        region.getPlaces().remove(place);
    }

    @Override
    public void addNewRegionToPlace(EntryDTO region, Long placeId) {
        Place place = placeRepository.findById(placeId).orElseThrow(() -> new NotFoundException(String.format(PLACE_NOT_FOUND_MSG, placeId)));
        Region newRegion = regionRepository.save(new Region(region.name(), region.description(), place));
        place.setRegion(newRegion);
    }
}
