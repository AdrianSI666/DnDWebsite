package com.as.dndwebsite.creatures.types.species.subspecies;

import com.as.dndwebsite.creatures.types.species.Species;
import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.geographic.plane.continent.region.Region;
import com.as.dndwebsite.world.World;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
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
@Table(name = "sub_species", schema = "public")
public class SubSpecies extends Entry {
    @ManyToOne(fetch = FetchType.LAZY)
    @ToString.Exclude
    private Species species;
    @ManyToMany(mappedBy = "subSpecies")
    @ToString.Exclude
    private Set<Region> regions = new HashSet<>();

    public SubSpecies(String name, String description, World world) {
        super(name, description, world);
    }

    public SubSpecies(String name, String description, Region region) {
        super(name, description, region.getWorld());
        this.regions.add(region);
    }

    public SubSpecies(String name, String description, Species species) {
        super(name, description, species.getWorld());
        this.species = species;
    }

    @PreRemove
    private void removeMembers() {
        this.regions.forEach(region -> region.getSubSpecies().removeIf(subRace -> subRace == this));
        this.regions.clear();
    }
}