package com.as.dndwebsite.places;

import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.places.kingdom.Kingdom;
import lombok.*;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Collection;

@Entity
@Getter
@Setter
@ToString
@RequiredArgsConstructor
@AllArgsConstructor
@Table(name="continent", schema = "public")
public class Continent extends Entry {
    @OneToMany(mappedBy = "continent")
    private Collection<Kingdom> kingdoms = new ArrayList<>();

    public Continent(String name, String description) {
        super(name, description);
    }

    public Continent(String name, String description, Kingdom kingdom) {
        super(name, description);
        this.kingdoms.add(kingdom);
    }
}
