package com.as.dndwebsite.image;

import com.as.dndwebsite.culture.Culture;
import com.as.dndwebsite.maps.Continent;
import com.as.dndwebsite.maps.kingdom.Kingdom;
import com.as.dndwebsite.maps.kingdom.region.Region;
import com.as.dndwebsite.maps.kingdom.region.place.Place;
import com.as.dndwebsite.race.Race;
import com.as.dndwebsite.race.subrace.SubRace;
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
        private Collection<Race> races;
        @ManyToMany(mappedBy = "images")
        @JsonBackReference
        private Collection<SubRace> subRaces;
        @ManyToMany(mappedBy = "images")
        @JsonBackReference
        private Collection<Culture> cultures;
        @ManyToMany(mappedBy = "images")
        @JsonBackReference
        private Collection<Continent> continents;
        @ManyToMany(mappedBy = "images")
        @JsonBackReference
        private Collection<Kingdom> kingdoms;
        @ManyToMany(mappedBy = "images")
        @JsonBackReference
        private Collection<Place> places;
        @ManyToMany(mappedBy = "images")
        @JsonBackReference
        private Collection<Region> regions;

        public Image(byte[] content, String name) {
                this.content = content;
                this.name = name;
        }
}
