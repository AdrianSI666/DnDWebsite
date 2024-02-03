package com.as.dndwebsite.places;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import org.springframework.data.domain.Page;

public interface IContinentService {
    Page<EntryDTO> getContinents(PageInfo page);

    EntryDTO getContinent(String name);

    EntryDTO saveContinent(Continent continent);

    void updateContinent(EntryDTO continent, Long id);

    void deleteContinent(Long id);
}
