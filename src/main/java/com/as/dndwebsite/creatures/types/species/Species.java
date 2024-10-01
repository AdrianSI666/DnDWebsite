package com.as.dndwebsite.creatures.types.species;

import com.as.dndwebsite.creatures.types.CreatureType;
import com.as.dndwebsite.creatures.types.species.subspecies.SubSpecies;
import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.geographic.plane.continent.region.Region;
import com.as.dndwebsite.world.World;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
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
@Table(name = "species", schema = "public")
public class Species extends Entry {
    @OneToMany(mappedBy = "species", fetch = FetchType.LAZY, cascade = CascadeType.DETACH)
    private Set<SubSpecies> subSpecies = new HashSet<>();
    @ManyToMany(mappedBy = "species")
    @ToString.Exclude
    private Set<Region> regions = new HashSet<>();
    @ManyToOne
    private CreatureType creatureType;
    @ManyToOne
    @ToString.Exclude
    private World world;

    public Species(String name, String description) {
        super(name, description);
    }
    public Species(String name, String description, Region region) {
        super(name, description);
        this.regions.add(region);
    }

    public Species(String name, String description, SubSpecies subSpecies) {
        super(name, description);
        this.subSpecies.add(subSpecies);
    }

    public Species(String name, String description, CreatureType creatureType) {
        super(name, description);
        this.creatureType = creatureType;
    }

    public Species(String name, String description, World world) {
        super(name, description);
        this.world = world;
    }

    @PreRemove
    private void removeMembers() {
        this.regions.forEach(region -> region.getSpecies().removeIf(race -> race == this));
        this.regions.clear();
    }
}
