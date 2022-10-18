package com.as.dndwebsite.repository.places;

import com.as.dndwebsite.domain.places.Place;
import com.as.dndwebsite.domain.places.Region;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PlaceRepository extends JpaRepository<Place, Long> {
    Optional<Place> findByName(String name);

    List<Place> findAllByRegion(Region region);
}