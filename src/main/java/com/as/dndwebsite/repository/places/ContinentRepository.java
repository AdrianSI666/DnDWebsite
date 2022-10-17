package com.as.dndwebsite.repository.places;

import com.as.dndwebsite.domain.places.Continent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ContinentRepository extends JpaRepository<Continent, Long> {
    Optional<Continent> findByName(String name);
}