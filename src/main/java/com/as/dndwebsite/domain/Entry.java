package com.as.dndwebsite.domain;

import com.as.dndwebsite.image.Image;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.MappedSuperclass;
import java.util.ArrayList;
import java.util.Collection;

@Getter
@Setter
@ToString
@RequiredArgsConstructor
@AllArgsConstructor
@MappedSuperclass
public abstract class Entry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true)
    private String name;
    @Column(columnDefinition = "TEXT")
    private String description;
    @ManyToMany(cascade = CascadeType.ALL)
    private Collection<Image> images = new ArrayList<>();
    protected Entry(String name, String description) {
        this.name = name;
        this.description = description;
    }
}
