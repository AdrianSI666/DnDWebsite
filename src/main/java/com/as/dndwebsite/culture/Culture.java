package com.as.dndwebsite.culture;

import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.domain.places.Region;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.ManyToMany;
import javax.persistence.Table;
import java.util.Collection;

@Entity
@Getter
@Setter
@ToString
@RequiredArgsConstructor
@AllArgsConstructor
@Table(name = "culture", schema = "public")
public class Culture extends Entry {
    @ManyToMany(mappedBy = "cultures")
    private Collection<Region> regions;

    public Culture(String name, String description) {
        super(name, description);
    }
}
