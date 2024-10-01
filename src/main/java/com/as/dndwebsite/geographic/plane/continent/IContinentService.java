package com.as.dndwebsite.geographic.plane.continent;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IContinentService {
    Page<EntryDTO> getContinents(PageInfo page);

    ContinentDTO getContinent(String name);

    EntryDTO saveContinent(EntryDTO continent);

    void updateContinent(EntryDTO continent, Long id);

    void deleteContinent(Long id);

    List<EntryDTO> getAllContinents();
}
