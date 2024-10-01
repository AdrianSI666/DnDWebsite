package com.as.dndwebsite.world;

import com.as.dndwebsite.creatures.types.CreatureType;
import com.as.dndwebsite.culture.Culture;
import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.geographic.plane.Plane;
import com.as.dndwebsite.geographic.plane.continent.Continent;
import com.as.dndwebsite.political.kingdom.Kingdom;
import com.as.dndwebsite.geographic.plane.continent.region.Region;
import com.as.dndwebsite.geographic.plane.continent.region.place.Place;
import com.as.dndwebsite.political.kingdom.county.County;
import com.as.dndwebsite.creatures.types.species.Species;
import com.as.dndwebsite.creatures.types.species.subspecies.SubSpecies;
import com.as.dndwebsite.user.AppUser;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.ArrayList;
import java.util.Collection;

@Entity
@Getter
@Setter
@ToString
@RequiredArgsConstructor
@AllArgsConstructor
@Table(name = "world", schema = "public")
public class World extends Entry {
    @OneToMany(mappedBy = "world")
    private Collection<Culture> cultures = new ArrayList<>();
    @OneToMany(mappedBy = "world")
    private Collection<CreatureType> creatureTypes = new ArrayList<>();
    @OneToMany(mappedBy = "world")
    private Collection<Species> species = new ArrayList<>();
    @OneToMany(mappedBy = "world")
    private Collection<SubSpecies> subSpecies = new ArrayList<>();
    @OneToMany(mappedBy = "world")
    private Collection<Plane> planes = new ArrayList<>();
    @OneToMany(mappedBy = "world")
    private Collection<Continent> continents = new ArrayList<>();
    @OneToMany(mappedBy = "world")
    private Collection<Kingdom> kingdoms = new ArrayList<>();
    @OneToMany(mappedBy = "world")
    private Collection<County> counties = new ArrayList<>();
    @OneToMany(mappedBy = "world")
    private Collection<Region> regions = new ArrayList<>();
    @OneToMany(mappedBy = "world")
    private Collection<Place> places = new ArrayList<>();
    @ManyToOne
    private AppUser author;

    public World(String name, String description) {
        super(name, description);
    }

    public World(String name, String description, Plane plane) {
        super(name, description);
        this.planes.add(plane);
    }

    public World(String name, String description, Culture culture) {
        super(name, description);
        this.cultures.add(culture);
    }

    public World(String name, String description, Continent continent) {
        super(name, description);
        this.continents.add(continent);
    }

    public World(String name, String description, Region region) {
        super(name, description);
        this.regions.add(region);
    }

    public World(String name, String description, Place place) {
        super(name, description);
        this.places.add(place);
    }

    public World(String name, String description, Kingdom kingdom) {
        super(name, description);
        this.kingdoms.add(kingdom);
    }

    public World(String name, String description, County county) {
        super(name, description);
        this.counties.add(county);
    }

    public World(String name, String description, Species species) {
        super(name, description);
        this.species.add(species);
    }

    public World(String name, String description, CreatureType creatureType) {
        super(name, description);
        this.creatureTypes.add(creatureType);
    }

    public World(String name, String description, SubSpecies subSpecies) {
        super(name, description);
        this.subSpecies.add(subSpecies);
    }
}
