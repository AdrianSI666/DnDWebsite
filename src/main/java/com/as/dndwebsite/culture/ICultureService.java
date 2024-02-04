package com.as.dndwebsite.culture;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ICultureService {
    List<EntryDTO> getAllCultures();

    Page<EntryDTO> getCultures(PageInfo page);

    EntryDTO getCulture(String name);

    EntryDTO saveCulture(EntryDTO culture);

    void updateCulture(EntryDTO culture, Long id);

    void deleteCulture(Long id);
}
