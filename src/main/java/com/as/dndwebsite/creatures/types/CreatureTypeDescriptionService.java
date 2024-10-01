package com.as.dndwebsite.creatures.types;

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

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
@Qualifier("creatureTypeDescriptionService")
public class CreatureTypeDescriptionService implements IDescriptionEntryService {
    private final CreatureTypeRepository creatureTypeRepository;
    private final DescriptionRepository descriptionRepository;
    private final IDescriptionService descriptionService;

    @Override
    public List<DescriptionDTO> getDescriptionsOfEntry(long id) {
        return descriptionRepository.findAllByCreatureTypes_IdOrderById(id);
    }

    @Override
    public DescriptionDTO saveDescriptionToEntry(DescriptionDTO descriptionDTO, Long id) {
        CreatureType creatureType = creatureTypeRepository.findById(id).orElseThrow(() -> new NotFoundException(String.format(CreatureTypeService.CREATURE_TYPE_NOT_FOUND_MSG, id)));
        return descriptionService.saveDescriptionToEntry(descriptionDTO, creatureType);
    }

    @Override
    public void deleteDescriptionFromEntry(Long entryId, Long descriptionId) {
        CreatureType creatureType = creatureTypeRepository.findById(entryId).orElseThrow(() -> new NotFoundException(String.format(CreatureTypeService.CREATURE_TYPE_NOT_FOUND_MSG, entryId)));
        descriptionService.deleteDescriptionFromEntry(creatureType, descriptionId);
    }
}
