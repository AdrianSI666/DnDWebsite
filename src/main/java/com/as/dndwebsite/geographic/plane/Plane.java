package com.as.dndwebsite.geographic.plane;

import com.as.dndwebsite.creatures.types.CreatureType;
import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.world.World;
import com.as.dndwebsite.geographic.plane.continent.Continent;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@ToString
@RequiredArgsConstructor
@AllArgsConstructor
@Table(name = "plane", schema = "public")
public class Plane extends Entry {
    @OneToMany(mappedBy = "plane")
    private Collection<Continent> continents = new ArrayList<>();
    @ManyToMany
    private Set<CreatureType> creatureTypes = new HashSet<>();
    @ManyToOne
    private World world;

    public Plane(String name, String description) {
        super(name, description);
    }

    public Plane(String name, String description, Continent continent) {
        super(name, description);
        this.continents.add(continent);
    }

    public Plane(String name, String description, World world) {
        super(name, description);
        this.world = world;
    }

    public Plane(String name, String description, CreatureType creatureType) {
        super(name, description);
        this.creatureTypes.add(creatureType);
    }
}
