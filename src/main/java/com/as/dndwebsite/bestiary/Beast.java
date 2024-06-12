package com.as.dndwebsite.bestiary;

import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.maps.plane.continent.kingdom.region.Region;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@ToString
@RequiredArgsConstructor
@AllArgsConstructor
@Table(name = "beast", schema = "public")
public class Beast extends Entry {
    @ManyToMany(mappedBy = "beasts")
    @ToString.Exclude
    private Set<Region> regions = new HashSet<>();

    public Beast(String name,String description){super(name,description);}
    public Beast(String name, String description, Region region){
        super(name,description);
        this.regions.add(region);
    }
    @PreRemove
    private void removeMembers() {
        this.regions.forEach(region -> region.getBeasts().removeIf(beast -> beast == this));
        this.regions.clear();
    }
}
