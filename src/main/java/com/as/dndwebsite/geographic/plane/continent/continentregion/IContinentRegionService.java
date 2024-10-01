package com.as.dndwebsite.geographic.plane.continent.continentregion;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

public interface IContinentRegionService {
    EntryDTO addNewRegionContinentRelation(Long continentId, EntryDTO region);

    void removeRegionContinentRelation(Long continentId, Long regionId);

    List<EntryDTO> getRegionsRelatedToContinent(Long continentId);

    Page<EntryDTO> getRegionsRelatedToContinent(String name, PageInfo pageInfo);

    EntryDTO addNewContinentRegionRelation(EntryDTO continent, Long regionId);

    void addRegionContinentRelation(Long continentId, Long regionId);

    EntryDTO getContinentRelatedToRegion(String name);

    Optional<EntryDTO> getContinentOfRegion(Long id);

    List<EntryDTO> getAllRegionsWithoutContinent();
}
