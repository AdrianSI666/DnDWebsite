package com.as.dndwebsite.description;

import com.as.dndwebsite.creatures.types.CreatureType;
import com.as.dndwebsite.creatures.types.species.Species;
import com.as.dndwebsite.creatures.types.species.subspecies.SubSpecies;
import com.as.dndwebsite.culture.Culture;
import com.as.dndwebsite.geographic.plane.Plane;
import com.as.dndwebsite.geographic.plane.continent.Continent;
import com.as.dndwebsite.geographic.plane.continent.region.Region;
import com.as.dndwebsite.geographic.plane.continent.region.place.Place;
import com.as.dndwebsite.political.kingdom.Kingdom;
import com.as.dndwebsite.political.kingdom.county.County;
import com.as.dndwebsite.world.World;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.Collection;

@Entity
@Getter
@Setter
@ToString
@RequiredArgsConstructor
@AllArgsConstructor
@Table(name = "description", schema = "public")
public class Description {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    @Column(columnDefinition = "TEXT")
    private String text;

//    private HiddenStatus hiddenStatus;
// TODO this will be implemented with addition to accounts, security and group of users who can see it

    @ManyToMany(mappedBy = "descriptions")
    @JsonBackReference
    private Collection<World> worlds;
    @ManyToMany(mappedBy = "descriptions")
    @JsonBackReference
    private Collection<CreatureType> creatureTypes;
    @ManyToMany(mappedBy = "descriptions")
    @JsonBackReference
    private Collection<Species> species;
    @ManyToMany(mappedBy = "descriptions")
    @JsonBackReference
    private Collection<SubSpecies> subSpecies;

    @ManyToMany(mappedBy = "descriptions")
    @JsonBackReference
    private Collection<Culture> cultures;

    @ManyToMany(mappedBy = "descriptions")
    @JsonBackReference
    private Collection<Plane> planes;
    @ManyToMany(mappedBy = "descriptions")
    @JsonBackReference
    private Collection<Continent> continents;
    @ManyToMany(mappedBy = "descriptions")
    @JsonBackReference
    private Collection<Place> places;
    @ManyToMany(mappedBy = "descriptions")
    @JsonBackReference
    private Collection<Region> regions;

    @ManyToMany(mappedBy = "descriptions")
    @JsonBackReference
    private Collection<Kingdom> kingdoms;
    @ManyToMany(mappedBy = "descriptions")
    @JsonBackReference
    private Collection<County> counties;

    public Description(String title, String text) {
        this.title = title;
        this.text = text;
    }
}
