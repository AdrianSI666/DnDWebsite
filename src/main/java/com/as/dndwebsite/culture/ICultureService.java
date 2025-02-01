package com.as.dndwebsite.culture;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.EntryDTOnWorldData;
import com.as.dndwebsite.dto.EntryFullDTO;
import com.as.dndwebsite.dto.PageInfo;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ICultureService {
    List<EntryDTO> getAllCultures(Long worldId);

    Page<EntryDTOnWorldData> getCultures(PageInfo page);

    EntryFullDTO getCulture(String name);

    EntryDTO saveCulture(EntryDTO culture, Long worldId);

    void updateCulture(EntryDTO culture, Long id);

    void deleteCulture(Long id);
}
