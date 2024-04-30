package com.as.dndwebsite.maps.plane;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IPlaneService {
    Page<EntryDTO> getPlanes(PageInfo page);

    EntryDTO getPlane(String name);

    EntryDTO savePlane(EntryDTO plane);

    void updatePlane(EntryDTO plane, Long id);

    void deletePlane(Long id);

    List<EntryDTO> getAllPlanes();
}
