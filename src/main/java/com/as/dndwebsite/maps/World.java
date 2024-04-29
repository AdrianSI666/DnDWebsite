package com.as.dndwebsite.maps;

import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.maps.plane.Plane;
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
@Table(name = "world", schema = "public")
public class World extends Entry {
    @OneToMany(mappedBy = "continent")
    private Collection<Plane> planes = new ArrayList<>();

    public World(String name, String description) {
        super(name, description);
    }

    public World(String name, String description, Plane plane) {
        super(name, description);
        this.planes.add(plane);
    }
}
