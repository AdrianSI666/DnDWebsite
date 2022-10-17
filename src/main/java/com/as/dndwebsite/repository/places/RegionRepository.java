package com.as.dndwebsite.repository.places;

import com.as.dndwebsite.domain.places.Kingdom;
import com.as.dndwebsite.domain.places.Region;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RegionRepository extends JpaRepository<Region, Long> {
    Optional<Region> findByName(String name);
    List<Region> findAllByKingdom(Kingdom kingdom);
}