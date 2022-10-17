package com.as.dndwebsite.repository;

import com.as.dndwebsite.domain.Culture;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CultureRepository extends JpaRepository<Culture, Long> {
    Optional<Culture> findByName(String name);
}