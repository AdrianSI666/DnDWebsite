package com.as.dndwebsite.maps;

import com.as.dndwebsite.description.DescriptionRepository;
import com.as.dndwebsite.description.IDescriptionEntryService;
import com.as.dndwebsite.description.IDescriptionService;
import com.as.dndwebsite.dto.DescriptionDTO;
import com.as.dndwebsite.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.as.dndwebsite.maps.WorldService.WORLD_NOT_FOUND_MSG;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
@Qualifier("worldDescriptionService")
public class WorldDescriptionService implements IDescriptionEntryService {
    private final WorldRepository worldRepository;
    private final DescriptionRepository descriptionRepository;
    private final IDescriptionService descriptionService;

    @Override
    public List<DescriptionDTO> getDescriptionsOfEntry(long id) {
        return descriptionRepository.findAllByWorlds_IdOrderById(id);
    }

    @Override
    public DescriptionDTO saveDescriptionToEntry(DescriptionDTO descriptionDTO, Long id) {
        World world = worldRepository.findById(id).orElseThrow(() -> new NotFoundException(String.format(WORLD_NOT_FOUND_MSG, id)));
        return descriptionService.saveDescriptionToEntry(descriptionDTO, world);
    }

    @Override
    public void deleteDescriptionFromEntry(Long entryId, Long descriptionId) {
        World world = worldRepository.findById(entryId).orElseThrow(() -> new NotFoundException(String.format(WORLD_NOT_FOUND_MSG, entryId)));
        descriptionService.deleteDescriptionFromEntry(world, descriptionId);
    }
}
