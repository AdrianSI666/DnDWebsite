package com.as.dndwebsite.places.kingdom.region.place.placesubrace;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import com.as.dndwebsite.exception.NotFoundException;
import com.as.dndwebsite.places.kingdom.region.place.Place;
import com.as.dndwebsite.places.kingdom.region.place.PlaceRepository;
import com.as.dndwebsite.race.subrace.SubRace;
import com.as.dndwebsite.race.subrace.SubRaceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.as.dndwebsite.places.kingdom.region.place.PlaceService.PLACE_NOT_FOUND_MSG;
import static com.as.dndwebsite.race.subrace.SubRaceService.SUB_RACE_NOT_FOUND_MSG;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class PlaceSubRaceService implements IPlaceSubRaceService {
    private final PlaceRepository placeRepository;
    private final SubRaceRepository subRaceRepository;

    @Override
    public Page<EntryDTO> getSubRacesRelatedToPlace(String name, PageInfo page) {
        Pageable paging = PageRequest.of(page.number() - 1, page.size(), Sort.by(Sort.Direction.DESC, "id"));
        return subRaceRepository.findAllByPlaces_Name(name, paging);
    }

    @Override
    public List<EntryDTO> getSubRacesRelatedToPlace(Long id) {
        log.info("Getting races related to place with id {}", id);
        return subRaceRepository.findAllByPlaces_Id(id);
    }

    @Override
    public void addSubRaceToPlace(Long subRaceId, Long placeId) {
        SubRace subrace = subRaceRepository.findById(subRaceId)
                .orElseThrow(() -> new NotFoundException(String.format(SUB_RACE_NOT_FOUND_MSG, subRaceId)));
        Place place = placeRepository.findById(placeId).orElseThrow(() -> new NotFoundException(String.format(PLACE_NOT_FOUND_MSG, placeId)));
        place.getSubRaces().add(subrace);
    }

    @Override
    public void removeSubRaceFromPlace(Long subRaceId, Long placeId) {
        SubRace subrace = subRaceRepository.findById(subRaceId)
                .orElseThrow(() -> new NotFoundException(String.format(SUB_RACE_NOT_FOUND_MSG, subRaceId)));
        Place place = placeRepository.findById(placeId).orElseThrow(() -> new NotFoundException(String.format(PLACE_NOT_FOUND_MSG, placeId)));
        place.getSubRaces().remove(subrace);
    }

    @Override
    public void addNewSubRaceToPlace(EntryDTO subRace, Long placeId) {
        Place place = placeRepository.findById(placeId).orElseThrow(() -> new NotFoundException(String.format(PLACE_NOT_FOUND_MSG, placeId)));
        SubRace newSubRace = subRaceRepository.save(new SubRace(subRace.name(), subRace.description(), place));
        place.getSubRaces().add(newSubRace);
    }
}
