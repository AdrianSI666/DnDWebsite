package com.as.dndwebsite.repository;

import com.as.dndwebsite.domain.Image;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageRepository extends JpaRepository<Image, Long> {

}