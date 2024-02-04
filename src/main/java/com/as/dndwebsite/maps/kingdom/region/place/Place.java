package com.as.dndwebsite.maps.kingdom.region.place;

import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.maps.kingdom.region.Region;
import com.as.dndwebsite.race.Race;
import com.as.dndwebsite.race.subrace.SubRace;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.util.ArrayList;
import java.util.Collection;

@Entity
@Getter
@Setter
@ToString
@RequiredArgsConstructor
@AllArgsConstructor
@Table(name = "place", schema = "public")
public class Place extends Entry {
    @ManyToOne
    private Region region;
    @ManyToMany
    private Collection<Race> races = new ArrayList<>();
    @ManyToMany
    private Collection<SubRace> subRaces = new ArrayList<>();


    public Place(String name, String description) {
        super(name, description);
    }
    public Place(String name, String description, Region region) {
        super(name, description);
        this.region = region;
    }
}