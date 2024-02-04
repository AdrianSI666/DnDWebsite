package com.as.dndwebsite.race.subrace;

import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.maps.kingdom.region.Region;
import com.as.dndwebsite.race.Race;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.FetchType;
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
@Table(name = "sub_race", schema = "public")
public class SubRace extends Entry {
    @ManyToOne(fetch = FetchType.LAZY)
    private Race race;
    @ManyToMany(mappedBy = "subRaces")
    private Collection<Region> regions = new ArrayList<>();

    public SubRace(String name, String description) {
        super(name, description);
    }

    public SubRace(String name, String description, Region region) {
        super(name, description);
        this.regions.add(region);
    }

    public SubRace(String name, String description, Race race) {
        super(name, description);
        this.race = race;
    }
}