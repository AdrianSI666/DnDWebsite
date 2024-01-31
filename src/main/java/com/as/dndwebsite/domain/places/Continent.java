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
@Table(name="continent", schema = "public")
public class Continent extends Entry {
    @OneToMany(mappedBy = "continent")
    private Collection<Kingdom> kingdoms;


    public Continent(String name, String description) {
        super(name, description);
    }
}
