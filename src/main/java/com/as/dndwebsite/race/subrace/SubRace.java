package com.as.dndwebsite.race.subrace;

import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.maps.plane.continent.kingdom.region.Region;
import com.as.dndwebsite.race.Race;
import jakarta.persistence.PreRemove;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
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
    @ToString.Exclude
    private Race race;
    @ManyToMany(mappedBy = "subRaces")
    @ToString.Exclude
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

    @PreRemove
    private void removeMembers() {
        this.regions.forEach(region -> region.getSubRaces().removeIf(subRace -> subRace == this));
        this.regions.clear();
    }
}