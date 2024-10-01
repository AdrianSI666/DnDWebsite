package com.as.dndwebsite.image;

import com.as.dndwebsite.creatures.types.CreatureType;
import com.as.dndwebsite.culture.Culture;
import com.as.dndwebsite.political.kingdom.county.County;
import com.as.dndwebsite.world.World;
import com.as.dndwebsite.geographic.plane.Plane;
import com.as.dndwebsite.geographic.plane.continent.Continent;
import com.as.dndwebsite.political.kingdom.Kingdom;
import com.as.dndwebsite.geographic.plane.continent.region.Region;
import com.as.dndwebsite.geographic.plane.continent.region.place.Place;
import com.as.dndwebsite.creatures.types.species.Species;
import com.as.dndwebsite.creatures.types.species.subspecies.SubSpecies;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.JdbcTypeCode;

import java.sql.Types;
import java.util.Collection;

@Entity
@Getter
@Setter
@ToString
@RequiredArgsConstructor
@AllArgsConstructor
@Table(name="image", schema = "public")
public class Image {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private long id;
        @Lob
        @JdbcTypeCode(Types.LONGVARBINARY)
        private byte[] content;
        private String name;
        @ManyToMany(mappedBy = "images")
        @JsonBackReference
        private Collection<CreatureType> creatureTypes;
        @ManyToMany(mappedBy = "images")
        @JsonBackReference
        private Collection<Species> species;
        @ManyToMany(mappedBy = "images")
        @JsonBackReference
        private Collection<SubSpecies> subSpecies;
        @ManyToMany(mappedBy = "images")
        @JsonBackReference
        private Collection<Culture> cultures;
        @ManyToMany(mappedBy = "images")
        @JsonBackReference
        private Collection<World> worlds;
        @ManyToMany(mappedBy = "images")
        @JsonBackReference
        private Collection<Plane> planes;
        @ManyToMany(mappedBy = "images")
        @JsonBackReference
        private Collection<Continent> continents;
        @ManyToMany(mappedBy = "images")
        @JsonBackReference
        private Collection<Place> places;
        @ManyToMany(mappedBy = "images")
        @JsonBackReference
        private Collection<Region> regions;

        @ManyToMany(mappedBy = "images")
        @JsonBackReference
        private Collection<Kingdom> kingdoms;
        @ManyToMany(mappedBy = "images")
        @JsonBackReference
        private Collection<County> counties;


        public Image(byte[] content, String name) {
                this.content = content;
                this.name = name;
        }
}
