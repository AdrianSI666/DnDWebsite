package com.as.dndwebsite.places.kingdom.region;

import com.as.dndwebsite.culture.Culture;
import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.places.kingdom.region.place.Place;
import com.as.dndwebsite.places.kingdom.Kingdom;
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
}