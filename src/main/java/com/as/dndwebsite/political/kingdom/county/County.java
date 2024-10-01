package com.as.dndwebsite.political.kingdom.county;

import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.geographic.plane.continent.region.Region;
import com.as.dndwebsite.political.kingdom.Kingdom;
import com.as.dndwebsite.world.World;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.apache.commons.lang3.builder.ToStringExclude;

import java.util.ArrayList;
import java.util.Collection;

@Entity
@Getter
@Setter
@ToString
@RequiredArgsConstructor
@AllArgsConstructor
@Table(name = "county", schema = "public")
public class County extends Entry {
    @ManyToMany(mappedBy = "counties")
    @ToStringExclude
    private Collection<Region> regions = new ArrayList<>();
    @ManyToOne
    @ToString.Exclude
    private Kingdom kingdom;
    @ManyToOne
    @ToString.Exclude
    private World world;

    public County(String name, String description) {
        super(name, description);
    }

    public County(String name, String description, Kingdom kingdom) {
        super(name, description);
        this.kingdom = kingdom;
    }

    public County(String name, String description, Region region) {
        super(name, description);
        this.regions.add(region);
    }

    public County(String name, String description, World world) {
        super(name, description);
        this.world = world;
    }
}
