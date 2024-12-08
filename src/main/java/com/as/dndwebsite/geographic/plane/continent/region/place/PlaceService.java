package com.as.dndwebsite.geographic.plane.continent.region.place;

import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.EntryFullDTO;
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
public class PlaceService implements IPlaceService {
    private final PlaceRepository placeRepository;
    private final WorldRepository worldRepository;
    private final DomainMapper<Entry, EntryDTO> mapper;
    private final DescriptionMapper descriptionMapper;
    private final ImageMapper imageMapper;
    public static final String PLACE_NOT_FOUND_MSG =
            "Place with name %s not found";
    private final OwningSecurityFunctions owningSecurityFunctions;
    @Override
    public Page<EntryDTO> getPlaces(PageInfo page) {
        log.info("Getting Places");
        Pageable paging = PageRequest.of(page.number() - 1, page.size(), Sort.by(Sort.Direction.DESC, "id"));
        return placeRepository.findAll(paging).map(mapper::map);
    }

    @Override
    public EntryFullDTO getPlace(String name) {
        log.info("Getting Place");
        Place place = placeRepository.findByName(name).orElseThrow(
                () -> new NotFoundException(String.format(PLACE_NOT_FOUND_MSG, name)));
        Optional<EntryDTO> region = Optional.empty();
        if(place.getRegion() != null) region = Optional.of(mapper.map(place.getRegion()));
        return new EntryFullDTO(mapper.map(place),
                region,
                null,
                place.getDescriptions().stream().map(descriptionMapper::map).toList(),
                place.getImages().stream().map(imageMapper::map).toList());
    }

    @Override
    public EntryDTO savePlace(EntryDTO place, Long worldId) {
        log.debug("Saving new Place {}", place.name());
        World world = worldRepository.findById(worldId).orElseThrow(
                () -> new NotFoundException(String.format(WORLD_NOT_FOUND_MSG, worldId)));
        owningSecurityFunctions.checkIfLoggedInUserIsTheSameAsAuthor(world.getAuthor(), "Save new place", world.getId());
        return mapper.map(placeRepository.save(new Place(place.name(), place.shortDescription(), world)));
    }

    @Override
    public void updatePlace(EntryDTO place, Long id) {
        log.debug("Updating place with id: {}", id);
        Place oldPlace = placeRepository.findById(id).orElseThrow(
                () -> new NotFoundException(String.format(PLACE_NOT_FOUND_MSG, id)));
        owningSecurityFunctions.checkIfLoggedInUserIsTheSameAsAuthor(oldPlace.getWorld().getAuthor(), "Update place", oldPlace.getId());
        oldPlace.setName(place.name());
        oldPlace.setShortDescription(place.shortDescription());
    }

    @Override
    public void deletePlace(Long id) {
        log.debug("Deleting place with id: {}", id);
        Place place = placeRepository.findById(id).orElseThrow(
                () -> new NotFoundException(String.format(PLACE_NOT_FOUND_MSG, id)));
        owningSecurityFunctions.checkIfLoggedInUserIsTheSameAsAuthor(place.getWorld().getAuthor(), "Delete place", place.getId());
        placeRepository.delete(place);
    }

    @Override
    public List<EntryDTO> getAllPlaces() {
        return placeRepository.findAll().stream().map(mapper::map).toList();
    }

}
