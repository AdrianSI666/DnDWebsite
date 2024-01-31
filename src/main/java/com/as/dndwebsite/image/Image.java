package com.as.dndwebsite.image;

import com.as.dndwebsite.culture.Culture;
import com.as.dndwebsite.domain.places.Continent;
import com.as.dndwebsite.domain.places.Kingdom;
import com.as.dndwebsite.domain.places.Place;
import com.as.dndwebsite.domain.places.Region;
import com.as.dndwebsite.race.Race;
import com.as.dndwebsite.race.subrace.SubRace;
import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.*;
import org.hibernate.annotations.Type;

import javax.persistence.*;
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
        @Type(type = "org.hibernate.type.ImageType")
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
