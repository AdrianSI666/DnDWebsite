package com.as.dndwebsite.geographic.plane.continent;

import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.geographic.plane.Plane;
import com.as.dndwebsite.geographic.plane.continent.region.Region;
import com.as.dndwebsite.political.kingdom.Kingdom;
import com.as.dndwebsite.world.World;
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

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@ToString
@RequiredArgsConstructor
@AllArgsConstructor
@Table(name = "continent", schema = "public")
public class Continent extends Entry {
    @ManyToMany(mappedBy = "continents")
    private Set<Kingdom> kingdoms = new HashSet<>();
    @OneToMany(mappedBy = "continent")
    private Set<Region> regions = new HashSet<>();
    @ManyToOne
    private Plane plane;
    @ManyToOne
    @ToString.Exclude
    private World world;

    public Continent(String name, String description) {
        super(name, description);
    }

    public Continent(String name, String description, Kingdom kingdom) {
        super(name, description);
        this.kingdoms.add(kingdom);
    }

    public Continent(String name, String description, Plane plane) {
        super(name, description);
        this.plane = plane;
    }

    public Continent(String name, String description, World world) {
        super(name, description);
        this.world = world;
    }

    public Continent(String name, String description, Region region) {
        super(name, description);
        this.regions.add(region);
    }
}
