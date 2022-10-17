package com.as.dndwebsite.domain.places;

import com.as.dndwebsite.domain.Image;
import com.as.dndwebsite.domain.Race;
import com.as.dndwebsite.domain.Subrace;
import lombok.*;

import javax.persistence.*;
import java.util.Collection;

@Entity
@Getter
@Setter
@ToString
@RequiredArgsConstructor
@AllArgsConstructor
@Table(name="place", schema = "public")
public class Place {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique=true)
    private String name;
    @Column(columnDefinition="TEXT")
    private String description;
    @ManyToOne
    private Region region;
    @ManyToMany
    private Collection<Image> images;
    @ManyToMany
    private Collection<Race> races;
    @ManyToMany
    private Collection<Subrace> subRaces;
}