package com.as.dndwebsite.description;

import com.as.dndwebsite.bestiary.Beast;
import com.as.dndwebsite.culture.Culture;
import com.as.dndwebsite.maps.World;
import com.as.dndwebsite.maps.plane.Plane;
import com.as.dndwebsite.maps.plane.continent.Continent;
import com.as.dndwebsite.maps.plane.continent.kingdom.Kingdom;
import com.as.dndwebsite.maps.plane.continent.kingdom.region.Region;
import com.as.dndwebsite.maps.plane.continent.kingdom.region.place.Place;
import com.as.dndwebsite.race.Race;
import com.as.dndwebsite.race.subrace.SubRace;
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
    private Collection<Race> races;
    @ManyToMany(mappedBy = "descriptions")
    @JsonBackReference
    private Collection<SubRace> subRaces;
    @ManyToMany(mappedBy = "descriptions")
    @JsonBackReference
    private Collection<Culture> cultures;
    @ManyToMany(mappedBy = "descriptions")
    @JsonBackReference
    private Collection<World> worlds;
    @ManyToMany(mappedBy = "descriptions")
    @JsonBackReference
    private Collection<Plane> planes;
    @ManyToMany(mappedBy = "descriptions")
    @JsonBackReference
    private Collection<Continent> continents;
    @ManyToMany(mappedBy = "descriptions")
    @JsonBackReference
    private Collection<Kingdom> kingdoms;
    @ManyToMany(mappedBy = "descriptions")
    @JsonBackReference
    private Collection<Place> places;
    @ManyToMany(mappedBy = "descriptions")
    @JsonBackReference
    private Collection<Region> regions;

    @ManyToMany(mappedBy = "descriptions")
    @JsonBackReference
    private Collection<Beast> beasts;

    public Description(String title, String text) {
        this.title = title;
        this.text = text;
    }
}
