package com.as.dndwebsite.geographic.plane.continent.region;

import com.as.dndwebsite.creatures.types.species.Species;
import com.as.dndwebsite.creatures.types.species.subspecies.SubSpecies;
import com.as.dndwebsite.culture.Culture;
import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.geographic.plane.continent.Continent;
import com.as.dndwebsite.geographic.plane.continent.region.place.Place;
import com.as.dndwebsite.political.kingdom.county.County;
import com.as.dndwebsite.world.World;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PreRemove;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@ToString
@RequiredArgsConstructor
@AllArgsConstructor
@Table(name = "region", schema = "public")
public class Region extends Entry {
    @ManyToOne
    private Continent continent;
    @ManyToMany
    private Set<County> counties = new HashSet<>();
    @OneToMany(mappedBy = "region")
    private Set<Place> places = new HashSet<>();
    @ManyToMany
    private Set<Culture> cultures = new HashSet<>();
    @ManyToMany
    private Set<Species> species = new HashSet<>();
    @ManyToMany
    private Set<SubSpecies> subSpecies = new HashSet<>();

    public Region(String name, String shortDescription, World world) {
        super(name, shortDescription, world);
    }

    public Region(String name, String description, County county) {
        super(name, description, county.getWorld());
        this.counties.add(county);
    }

    public Region(String name, String description, Continent continent) {
        super(name, description, continent.getWorld());
        this.continent = continent;
    }

    public Region(String name, String description, Place place) {
        super(name, description, place.getWorld());
        this.places.add(place);
    }

    public Region(String name, String description, Culture culture) {
        super(name, description, culture.getWorld());
        this.cultures.add(culture);
    }

    public Region(String name, String description, Species species) {
        super(name, description, species.getWorld());
        this.species.add(species);
    }

    public Region(String name, String description, SubSpecies subSpecies) {
        super(name, description, subSpecies.getWorld());
        this.subSpecies.add(subSpecies);
    }

    @PreRemove
    private void removeMembers() {
        this.cultures.forEach(culture -> culture.getRegions().removeIf(region -> region == this));
        this.cultures.clear();
        this.species.forEach(specie -> specie.getRegions().removeIf(region -> region == this));
        this.species.clear();
        this.subSpecies.forEach(subSpecie -> subSpecie.getRegions().removeIf(region -> region == this));
        this.subSpecies.clear();
    }
}