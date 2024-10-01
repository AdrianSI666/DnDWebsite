package com.as.dndwebsite.culture;

import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.geographic.plane.continent.region.Region;
import com.as.dndwebsite.world.World;
import jakarta.persistence.Entity;
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
@Table(name = "culture", schema = "public")
public class Culture extends Entry {
    @ManyToMany(mappedBy = "cultures")
    @ToString.Exclude
    private Set<Region> regions = new HashSet<>();
    @ManyToOne
    @ToString.Exclude
    private World world;

    public Culture(String name, String description) {
        super(name, description);
    }

    public Culture(String name, String description, Region region) {
        super(name, description);
        regions.add(region);
    }

    public Culture(String name, String shortDescription, World world) {
        super(name, shortDescription);
        this.world = world;
    }

    @PreRemove
    private void removeMembers() {
        this.regions.forEach(region -> region.getCultures().removeIf(culture -> culture == this));
        this.regions.clear();
    }
}
