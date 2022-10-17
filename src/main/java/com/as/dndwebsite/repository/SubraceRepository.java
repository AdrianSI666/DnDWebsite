package com.as.dndwebsite.repository;

import com.as.dndwebsite.domain.Race;
import com.as.dndwebsite.domain.Subrace;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SubraceRepository extends JpaRepository<Subrace, Long> {
    Optional<Subrace> findByName(String name);
    List<Subrace> findAllByRace(Race race);
    void deleteAllByRaceId(Long id);
}