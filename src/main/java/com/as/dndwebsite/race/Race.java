package com.as.dndwebsite.race;

import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.maps.kingdom.region.Region;
import com.as.dndwebsite.race.subrace.SubRace;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.Collection;


@Entity
@Getter
@Setter
@ToString
@RequiredArgsConstructor
@AllArgsConstructor
@Table(name = "race", schema = "public")
public class Race extends Entry {
    @OneToMany(mappedBy = "race", fetch = FetchType.LAZY)
    private Collection<SubRace> subRaces = new ArrayList<>();
    @ManyToMany(mappedBy = "races")
    private Collection<Region> regions = new ArrayList<>();

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
}
