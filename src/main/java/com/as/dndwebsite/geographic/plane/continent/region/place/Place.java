package com.as.dndwebsite.geographic.plane.continent.region.place;

import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.geographic.plane.continent.region.Region;
import com.as.dndwebsite.world.World;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@ToString
@RequiredArgsConstructor
@AllArgsConstructor
@Table(name = "place", schema = "public")
public class Place extends Entry {
    @ManyToOne
    private Region region;

    public Place(String name, String description, World world) {
        super(name, description, world);
    }

    public Place(String name, String description, Region region) {
        super(name, description, region.getWorld());
        this.region = region;
    }
}