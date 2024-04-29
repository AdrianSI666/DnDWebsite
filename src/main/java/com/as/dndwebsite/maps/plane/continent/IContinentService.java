package com.as.dndwebsite.maps.plane.continent;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IContinentService {
    Page<EntryDTO> getContinents(PageInfo page);

    EntryDTO getContinent(String name);

    EntryDTO saveContinent(Continent continent);

    void updateContinent(EntryDTO continent, Long id);

    void deleteContinent(Long id);

    List<EntryDTO> getAllContinents();
}
