package com.as.dndwebsite.domain.places;

import com.as.dndwebsite.domain.Entry;
import lombok.*;

import javax.persistence.*;
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
    private Collection<Region> regions;


    public Kingdom(String name, String description) {
        super(name, description);
    }
}