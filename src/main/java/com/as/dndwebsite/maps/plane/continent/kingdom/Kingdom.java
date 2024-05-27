package com.as.dndwebsite.maps.plane.continent.kingdom;

import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.maps.plane.continent.Continent;
import com.as.dndwebsite.maps.plane.continent.kingdom.region.Region;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
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
    @ManyToOne
    private Continent continent;
    @OneToMany(mappedBy = "kingdom")
    private Collection<Region> regions = new ArrayList<>();

    public Kingdom(String name, String description) {
        super(name, description);
    }

    public Kingdom(String name, String description, Continent continent) {
        super(name, description);
        this.continent = continent;
    }

    public Kingdom(String name, String description, Region region) {
        super(name, description);
        this.regions.add(region);
    }
}