package com.as.dndwebsite.political.kingdom;

import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.geographic.plane.continent.Continent;
import com.as.dndwebsite.political.kingdom.county.County;
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
import org.apache.commons.lang3.builder.ToStringExclude;

import java.util.ArrayList;
import java.util.Collection;

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
    private Collection<Continent> continents = new ArrayList<>();
    @OneToMany(mappedBy = "kingdom")
    private Collection<County> counties;
    @ManyToOne
    @ToString.Exclude
    private World world;

    public Kingdom(String name, String description) {
        super(name, description);
    }

    public Kingdom(String name, String description, Continent continent) {
        super(name, description);
        this.continents.add(continent);
    }

    public Kingdom(String name, String description, County county) {
        super(name, description);
        this.counties.add(county);
    }

    public Kingdom(String name, String description, World world) {
        super(name, description);
        this.world = world;
    }
}