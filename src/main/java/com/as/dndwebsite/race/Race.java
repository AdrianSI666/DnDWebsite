package com.as.dndwebsite.race;

import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.places.kingdom.region.place.Place;
import com.as.dndwebsite.race.subrace.SubRace;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.Table;
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
    private Collection<Place> places = new ArrayList<>();

    public Race(String name, String description) {
        super(name, description);
    }
    public Race(String name, String description, Place place) {
        super(name, description);
        this.places.add(place);
    }
}
