package com.as.dndwebsite.places.kingdom.region.place.placerace;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import com.as.dndwebsite.exception.NotFoundException;
import com.as.dndwebsite.places.kingdom.region.place.Place;
import com.as.dndwebsite.places.kingdom.region.place.PlaceRepository;
import com.as.dndwebsite.race.Race;
import com.as.dndwebsite.race.RaceRepository;
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
import static com.as.dndwebsite.race.RaceService.RACE_NOT_FOUND_MSG;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class PlaceRaceService implements IPlaceRaceService {
    private final PlaceRepository placeRepository;
    private final RaceRepository raceRepository;

    @Override
    public Page<EntryDTO> getRacesRelatedToPlace(String name, PageInfo page) {
        Pageable paging = PageRequest.of(page.number() - 1, page.size(), Sort.by(Sort.Direction.DESC, "id"));
        return raceRepository.findAllByPlaces_Name(name, paging);
    }

    @Override
    public List<EntryDTO> getRacesRelatedToPlace(Long id) {
        log.info("Getting races related to place with id {}", id);
        return raceRepository.findAllByPlaces_Id(id);
    }

    @Override
    public void addRaceToPlace(Long raceId, Long placeId) {
        Race race = raceRepository.findById(raceId).orElseThrow(() -> new NotFoundException(String.format(RACE_NOT_FOUND_MSG, raceId)));
        Place place = placeRepository.findById(placeId).orElseThrow(() -> new NotFoundException(String.format(PLACE_NOT_FOUND_MSG, placeId)));
        place.getRaces().add(race);
        race.getPlaces().add(place);
    }

    @Override
    public void removeRaceFromPlace(Long raceId, Long placeId) {
        Race race = raceRepository.findById(raceId).orElseThrow(() -> new NotFoundException(String.format(RACE_NOT_FOUND_MSG, raceId)));
        Place place = placeRepository.findById(placeId).orElseThrow(() -> new NotFoundException(String.format(PLACE_NOT_FOUND_MSG, placeId)));
        place.getRaces().remove(race);
        race.getPlaces().remove(place);
    }

    @Override
    public void addNewRaceToPlace(EntryDTO race, Long placeId) {
        Place place = placeRepository.findById(placeId).orElseThrow(() -> new NotFoundException(String.format(PLACE_NOT_FOUND_MSG, placeId)));
        Race newRace = raceRepository.save(new Race(race.name(), race.description(), place));
        place.getRaces().add(newRace);
    }
}
