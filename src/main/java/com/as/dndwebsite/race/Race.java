package com.as.dndwebsite.race;

import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.maps.kingdom.region.Region;
import com.as.dndwebsite.race.subrace.SubRace;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PreRemove;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.HashSet;
import java.util.Set;


@Entity
@Getter
@Setter
@ToString
@RequiredArgsConstructor
@AllArgsConstructor
@Table(name = "race", schema = "public")
public class Race extends Entry {
    @OneToMany(mappedBy = "race", fetch = FetchType.LAZY)
    private Set<SubRace> subRaces = new HashSet<>();
    @ManyToMany(mappedBy = "races")
    @ToString.Exclude
    private Set<Region> regions = new HashSet<>();

    public Race(String name, String description) {
        super(name, description);
    }
    public Race(String name, String description, Region region) {
        super(name, description);
        this.regions.add(region);
    }

    public Race(String name, String description, SubRace subRace) {
        super(name, description);
        this.subRaces.add(subRace);
    }

    @PreRemove
    private void removeMembers() {
        this.regions.forEach(region -> region.getRaces().removeIf(race -> race == this));
        this.regions.clear();
    }
}
