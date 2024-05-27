package com.as.dndwebsite.maps.plane.continent.kingdom.region;

import com.as.dndwebsite.culture.Culture;
import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.maps.plane.continent.kingdom.Kingdom;
import com.as.dndwebsite.maps.plane.continent.kingdom.region.place.Place;
import com.as.dndwebsite.race.Race;
import com.as.dndwebsite.race.subrace.SubRace;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PreRemove;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Set;

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
    private Set<Place> places = new LinkedHashSet<>();
    @ManyToMany
    private Set<Culture> cultures = new HashSet<>();
    @ManyToMany
    private Set<Race> races = new HashSet<>();
    @ManyToMany
    private Set<SubRace> subRaces = new HashSet<>();

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

    @PreRemove
    private void removeMembers() {
        this.cultures.forEach(culture -> culture.getRegions().removeIf(region -> region == this));
        this.cultures.clear();
        this.races.forEach(race -> race.getRegions().removeIf(region -> region == this));
        this.races.clear();
        this.subRaces.forEach(subRace -> subRace.getRegions().removeIf(region -> region == this));
        this.subRaces.clear();
    }
}