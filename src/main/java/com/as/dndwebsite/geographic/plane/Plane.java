package com.as.dndwebsite.geographic.plane;

import com.as.dndwebsite.creatures.types.CreatureType;
import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.geographic.plane.continent.Continent;
import com.as.dndwebsite.world.World;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

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
    private Set<Continent> continents;
    @ManyToMany
    private Set<CreatureType> creatureTypes;

    public Plane(String name, String description, World world) {
        super(name, description, world);
    }

    public Plane(String name, String description, Continent continent) {
        super(name, description, continent.getWorld());
        this.continents.add(continent);
    }

    public Plane(String name, String description, CreatureType creatureType) {
        super(name, description, creatureType.getWorld());
        this.creatureTypes.add(creatureType);
    }
}
