package com.as.dndwebsite.domain.places;

import com.as.dndwebsite.domain.Image;
import lombok.*;

import javax.persistence.*;
import java.util.Collection;

@Entity
@Getter
@Setter
@ToString
@RequiredArgsConstructor
@AllArgsConstructor
@Table(name = "kingdom", schema = "public")
public class Kingdom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique=true)
    private String name;
    @Column(columnDefinition="TEXT")
    private String description;
    @ManyToOne
    private Continent continent;
    @ManyToMany(cascade=CascadeType.ALL)
    private Collection<Image> images;
}