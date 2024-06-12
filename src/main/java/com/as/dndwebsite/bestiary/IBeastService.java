package com.as.dndwebsite.bestiary;

import com.as.dndwebsite.dto.EntryDTO;
import com.as.dndwebsite.dto.PageInfo;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IBeastService {
    Page<EntryDTO> getBeasts(PageInfo page);
    EntryDTO getBeast(String name);
    EntryDTO saveBeast(EntryDTO beast);
    void updateBeast(EntryDTO beast, Long id);
    void deleteBest(Long id);
    List<EntryDTO> getAllBeasts();
}
