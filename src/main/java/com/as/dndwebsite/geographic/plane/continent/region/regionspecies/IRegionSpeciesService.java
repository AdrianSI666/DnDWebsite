package com.as.dndwebsite.geographic.plane.continent.region.regionspecies;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IRegionSpeciesService {
    Page<EntryDTO> getSpeciesRelatedToRegion(String name, PageInfo page);

    List<EntryDTO> getSpeciesRelatedToRegion(Long id);

    void addSpeciesToRegion(Long speciesId, Long regionId);

    void removeSpeciesFromRegion(Long speciesId, Long regionId);

    EntryDTO addNewSpeciesToRegion(EntryDTO species, Long regionId);

    List<EntryDTO> getRegionsRelatedToSpecies(Long id);

    Page<EntryDTO> getRegionsRelatedToSpecies(String name, PageInfo page);

    EntryDTO addNewRegionToSpecies(EntryDTO region, Long speciesId);
}
