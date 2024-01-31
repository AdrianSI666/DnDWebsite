package com.as.dndwebsite.domain.places;

import com.as.dndwebsite.culture.Culture;
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
@Table(name="region", schema = "public")
public class Region extends Entry {
    @ManyToOne
    private Kingdom kingdom;
    @OneToMany(mappedBy = "region")
    private Collection<Place> places;
    @ManyToMany
    private Collection<Culture> cultures;


    public Region(String name, String description) {
        super(name, description);
    }
}