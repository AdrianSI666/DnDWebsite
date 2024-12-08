package com.as.dndwebsite.creatures.types;

import com.as.dndwebsite.creatures.types.species.Species;
import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.geographic.plane.Plane;
import com.as.dndwebsite.world.World;
import jakarta.persistence.CascadeType;
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

import java.util.Set;

@Entity
@Getter
@Setter
@ToString
@RequiredArgsConstructor
@AllArgsConstructor
@Table(name = "creature_type", schema = "public")
public class CreatureType extends Entry {
    @OneToMany(mappedBy = "creatureType", fetch = FetchType.LAZY, cascade = CascadeType.DETACH)
    private Set<Species> species;
    @ManyToMany(mappedBy = "creatureTypes")
    @ToString.Exclude
    private Set<Plane> planes;

    public CreatureType(String name, String description, World world) {
        super(name, description, world);
    }

    public CreatureType(String name, String description, Plane plane) {
        super(name, description, plane.getWorld());
        this.planes.add(plane);
    }

    public CreatureType(String name, String description, Species specie) {
        super(name, description, specie.getWorld());
        this.species.add(specie);
    }

    @PreRemove
    private void removeMembers() {
        this.planes.forEach(plane -> plane.getCreatureTypes().removeIf(type -> type == this));
        this.planes.clear();
    }
}
