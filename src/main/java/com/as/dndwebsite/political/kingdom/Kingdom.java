package com.as.dndwebsite.political.kingdom;

import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.geographic.plane.continent.Continent;
import com.as.dndwebsite.political.kingdom.county.County;
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
import org.apache.commons.lang3.builder.ToStringExclude;

import java.util.Set;

@Entity
@Getter
@Setter
@ToString
@RequiredArgsConstructor
@AllArgsConstructor
@Table(name = "kingdom", schema = "public")
public class Kingdom extends Entry {
    @ManyToMany
    @ToStringExclude
    private Set<Continent> continents;
    @OneToMany(mappedBy = "kingdom")
    private Set<County> counties;

    public Kingdom(String name, String description, World world) {
        super(name, description, world);
        this.setWorld(world);
    }

    public Kingdom(String name, String description, Continent continent) {
        super(name, description, continent.getWorld());
        this.continents.add(continent);
    }

    public Kingdom(String name, String description, County county) {
        super(name, description, county.getWorld());
        this.counties.add(county);
    }
}