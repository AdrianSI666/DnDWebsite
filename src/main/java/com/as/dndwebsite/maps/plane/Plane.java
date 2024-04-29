package com.as.dndwebsite.maps.plane;

import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.maps.plane.continent.Continent;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.ArrayList;
import java.util.Collection;

@Entity
@Getter
@Setter
@ToString
@RequiredArgsConstructor
@AllArgsConstructor
@Table(name = "plane", schema = "public")
public class Plane extends Entry {
    @OneToMany(mappedBy = "continent")
    private Collection<Continent> continents = new ArrayList<>();

    public Plane(String name, String description) {
        super(name, description);
    }

    public Plane(String name, String description, Continent continent) {
        super(name, description);
        this.continents.add(continent);
    }
}
