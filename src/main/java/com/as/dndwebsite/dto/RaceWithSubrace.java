package com.as.dndwebsite.dto;

import com.as.dndwebsite.domain.Race;
import com.as.dndwebsite.domain.Subrace;

import java.util.List;

public record RaceWithSubrace (
    Race race,
    List<Subrace> subraceList
){

}
