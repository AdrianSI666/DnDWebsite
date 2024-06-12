package com.as.dndwebsite.maps.plane.continent.kingdom.region.regionbeast;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IRegionBeastService {
    Page<EntryDTO> getBeastsRelatedToRegion(String name, PageInfo page);
    List<EntryDTO> getBeastsRelatedToRegion(Long id);
    void addBeastToRegion(Long beastId,Long regionId);
    void removeBeastFromRegion(Long beastId,Long regionId);
    EntryDTO addNewBeastToRegion(EntryDTO beast, Long regionId);
    List<EntryDTO> getRegionsRelatedToBeast(Long id);
//    Page<EntryDTO> getRegionsRelatedToBeast(String name,PageInfo page);
    EntryDTO addNewRegionToBeast(EntryDTO region, Long beastId);
}
