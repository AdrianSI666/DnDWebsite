package com.as.dndwebsite.world;

import com.as.dndwebsite.creatures.types.CreatureType;
import com.as.dndwebsite.creatures.types.species.Species;
import com.as.dndwebsite.creatures.types.species.subspecies.SubSpecies;
import com.as.dndwebsite.culture.Culture;
import com.as.dndwebsite.description.Description;
import com.as.dndwebsite.geographic.plane.Plane;
import com.as.dndwebsite.geographic.plane.continent.Continent;
import com.as.dndwebsite.geographic.plane.continent.region.Region;
import com.as.dndwebsite.geographic.plane.continent.region.place.Place;
import com.as.dndwebsite.image.Image;
import com.as.dndwebsite.political.kingdom.Kingdom;
import com.as.dndwebsite.political.kingdom.county.County;
import com.as.dndwebsite.user.AppUser;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@ToString
@RequiredArgsConstructor
@AllArgsConstructor
@Table(name = "world", schema = "public")
public class World {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true)
    private String name;
    private String shortDescription;
    @ManyToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Collection<Description> descriptions;
    @ManyToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Collection<Image> images;
    @OneToMany(mappedBy = "world")
    private Set<Culture> cultures = new HashSet<>();
    @OneToMany(mappedBy = "world")
    private Set<CreatureType> creatureTypes = new HashSet<>();
    @OneToMany(mappedBy = "world")
    private Set<Species> species = new HashSet<>();
    @OneToMany(mappedBy = "world")
    private Set<SubSpecies> subSpecies = new HashSet<>();
    @OneToMany(mappedBy = "world")
    private Set<Plane> planes = new HashSet<>();
    @OneToMany(mappedBy = "world")
    private Set<Continent> continents = new HashSet<>();
    @OneToMany(mappedBy = "world")
    private Set<Kingdom> kingdoms = new HashSet<>();
    @OneToMany(mappedBy = "world")
    private Set<County> counties = new HashSet<>();
    @OneToMany(mappedBy = "world")
    private Set<Region> regions = new HashSet<>();
    @OneToMany(mappedBy = "world")
    private Set<Place> places = new HashSet<>();
    @ManyToOne
    private AppUser author;

    public World(String name, String description, AppUser appUser) {
        this.name = name;
        this.shortDescription = description;
        this.author = appUser;
    }

    public World(String name, String description, Plane plane) {
        this.name = name;
        this.shortDescription = description;
        this.planes.add(plane);
    }

    public World(String name, String description, Culture culture) {
        this.name = name;
        this.shortDescription = description;
        this.cultures.add(culture);
    }

    public World(String name, String description, Continent continent) {
        this.name = name;
        this.shortDescription = description;
        this.continents.add(continent);
    }

    public World(String name, String description, Region region) {
        this.name = name;
        this.shortDescription = description;
        this.regions.add(region);
    }

    public World(String name, String description, Place place) {
        this.name = name;
        this.shortDescription = description;
        this.places.add(place);
    }

    public World(String name, String description, Kingdom kingdom) {
        this.name = name;
        this.shortDescription = description;
        this.kingdoms.add(kingdom);
    }

    public World(String name, String description, County county) {
        this.name = name;
        this.shortDescription = description;
        this.counties.add(county);
    }

    public World(String name, String description, Species species) {
        this.name = name;
        this.shortDescription = description;
        this.species.add(species);
    }

    public World(String name, String description, CreatureType creatureType) {
        this.name = name;
        this.shortDescription = description;
        this.creatureTypes.add(creatureType);
    }

    public World(String name, String description, SubSpecies subSpecies) {
        this.name = name;
        this.shortDescription = description;
        this.subSpecies.add(subSpecies);
    }
}
