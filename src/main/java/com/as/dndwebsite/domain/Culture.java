package com.as.dndwebsite.domain;

import lombok.*;

import javax.persistence.*;
import java.util.Collection;

@Entity
@Getter
@Setter
@ToString
@RequiredArgsConstructor
@AllArgsConstructor
@Table(name="culture", schema = "public")
public class Culture {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique=true)
    private String name;
    @Column(columnDefinition="TEXT")
    private String description;
    @ManyToMany(cascade=CascadeType.ALL)
    private Collection<Image> images;
}
