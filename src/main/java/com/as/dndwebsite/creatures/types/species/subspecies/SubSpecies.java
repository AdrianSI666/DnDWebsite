package com.as.dndwebsite.creatures.types.species.subspecies;

import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.geographic.plane.continent.region.Region;
import com.as.dndwebsite.creatures.types.species.Species;
import com.as.dndwebsite.world.World;
import jakarta.persistence.PreRemove;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.Collection;


@Entity
@Getter
@Setter
@ToString
@RequiredArgsConstructor
@AllArgsConstructor
@Table(name = "sub_species", schema = "public")
public class SubSpecies extends Entry {
    @ManyToOne(fetch = FetchType.LAZY)
    @ToString.Exclude
    private Species species;
    @ManyToMany(mappedBy = "subSpecies")
    @ToString.Exclude
    private Collection<Region> regions = new ArrayList<>();
    @ManyToOne
    @ToString.Exclude
    private World world;

    public SubSpecies(String name, String description) {
        super(name, description);
    }

    public SubSpecies(String name, String description, Region region) {
        super(name, description);
        this.regions.add(region);
    }

    public SubSpecies(String name, String description, Species species) {
        super(name, description);
        this.species = species;
    }

    public SubSpecies(String name, String description, World world) {
        super(name, description);
        this.world = world;
    }

    @PreRemove
    private void removeMembers() {
        this.regions.forEach(region -> region.getSubSpecies().removeIf(subRace -> subRace == this));
        this.regions.clear();
    }
}