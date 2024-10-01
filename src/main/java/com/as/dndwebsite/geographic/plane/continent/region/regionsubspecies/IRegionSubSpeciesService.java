package com.as.dndwebsite.geographic.plane.continent.region.regionsubspecies;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IRegionSubSpeciesService {
    Page<EntryDTO> getSubSpeciesRelatedToRegion(String name, PageInfo page);

    List<EntryDTO> getSubSpeciesRelatedToRegion(Long id);

    void addSubSpeciesRegionRelation(Long subSpeciesId, Long regionId);

    void removeSubSpeciesRegionRelation(Long subSpeciesId, Long regionId);

    EntryDTO addNewSubSpeciesToRegion(EntryDTO subSpecies, Long regionId);

    EntryDTO addNewRegionSubSpeciesRelation(EntryDTO region, Long subSpeciesId);

    List<EntryDTO> getRegionsRelatedToSubSpecies(Long id);

    Page<EntryDTO> getRegionsRelatedToSubSpecies(String name, PageInfo pageInfo);
}
