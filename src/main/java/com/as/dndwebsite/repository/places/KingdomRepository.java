package com.as.dndwebsite.repository.places;

import com.as.dndwebsite.domain.places.Continent;
import com.as.dndwebsite.domain.places.Kingdom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface KingdomRepository extends JpaRepository<Kingdom, Long> {
    Optional<Kingdom> findByName(String name);
    List<Kingdom> findAllByContinent(Continent continent);
}