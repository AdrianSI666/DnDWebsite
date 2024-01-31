package com.as.dndwebsite.domain.places;

import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.race.Race;
import com.as.dndwebsite.race.subrace.SubRace;
import lombok.*;

import javax.persistence.*;
import java.util.Collection;

@Entity
@Getter
@Setter
@ToString
@RequiredArgsConstructor
@AllArgsConstructor
@Table(name="place", schema = "public")
public class Place extends Entry {
    @ManyToOne
    private Region region;
    @ManyToMany
    private Collection<Race> races;
    @ManyToMany
    private Collection<SubRace> subRaces;


    public Place(String name, String description) {
        super(name, description);
    }
}