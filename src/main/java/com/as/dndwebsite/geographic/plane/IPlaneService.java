package com.as.dndwebsite.geographic.plane;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.EntryDTOnWorldData;
import com.as.dndwebsite.dto.PageInfo;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IPlaneService {
    Page<EntryDTOnWorldData> getPlanes(PageInfo page);

    PlaneFullDTO getPlane(String name);

    EntryDTO savePlane(EntryDTO plane, Long worldId);

    void updatePlane(EntryDTO plane, Long id);

    void deletePlane(Long id);

    List<EntryDTO> getAllPlanes(Long worldId);
}
