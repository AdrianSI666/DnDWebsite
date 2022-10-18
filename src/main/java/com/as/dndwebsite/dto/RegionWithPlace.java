package com.as.dndwebsite.dto;

import com.as.dndwebsite.domain.places.Place;
import com.as.dndwebsite.domain.places.Region;

import java.util.List;

public record RegionWithPlace(
        Region region,
        List<Place> placeList
) {
}
