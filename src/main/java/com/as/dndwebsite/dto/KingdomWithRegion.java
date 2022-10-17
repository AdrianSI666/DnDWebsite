package com.as.dndwebsite.dto;

import com.as.dndwebsite.domain.places.Kingdom;
import com.as.dndwebsite.domain.places.Region;

import java.util.List;

public record KingdomWithRegion(
        Kingdom kingdom,
        List<Region> regionList
) {
}
