package com.as.dndwebsite.dto;

import com.as.dndwebsite.domain.places.Continent;
import com.as.dndwebsite.domain.places.Kingdom;

import java.util.List;

public record ContinentWithKingdom(
        Continent continent,
        List<Kingdom> kingdomList
) {
}
