package com.as.dndwebsite.maps.kingdom.region;

import com.as.dndwebsite.culture.Culture;
import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.maps.kingdom.region.place.Place;
import com.as.dndwebsite.maps.kingdom.Kingdom;
import com.as.dndwebsite.race.Race;
import com.as.dndwebsite.race.subrace.SubRace;
import lombok.*;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Collection;

@Entity
@Getter
@Setter
@ToString
@RequiredArgsConstructor
@AllArgsConstructor
@Table(name = "region", schema = "public")
public class Region extends Entry {
    @ManyToOne
    private Kingdom kingdom;
    @OneToMany(mappedBy = "region")
    private Collection<Place> places = new ArrayList<>();
    @ManyToMany
    private Collection<Culture> cultures = new ArrayList<>();
    @ManyToMany
    private Collection<Race> races = new ArrayList<>();
    @ManyToMany
    private Collection<SubRace> subRaces = new ArrayList<>();

    public Region(String name, String description) {
        super(name, description);
    }
    public Region(String name, String description, Kingdom kingdom) {
        super(name, description);
        this.kingdom = kingdom;
    }

    public Region(String name, String description, Place place) {
        super(name, description);
        this.places.add(place);
    }

    public Region(String name, String description, Culture culture) {
        super(name, description);
        this.cultures.add(culture);
    }

    public Region(String name, String description, Race race) {
        super(name, description);
        this.races.add(race);
    }

    public Region(String name, String description, SubRace subRace) {
        super(name, description);
        this.subRaces.add(subRace);
    }
}