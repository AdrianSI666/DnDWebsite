package com.as.dndwebsite.creatures.types.species.subspecies;

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
@Qualifier("subSpeciesDescriptionService")
public class SubSpeciesDescriptionService implements IDescriptionEntryService {
    private final SubSpeciesRepository subSpeciesRepository;
    private final DescriptionRepository descriptionRepository;
    private final IDescriptionService descriptionService;

    @Override
    public List<DescriptionDTO> getDescriptionsOfEntry(long id) {
        return descriptionRepository.findAllBySubSpecies_IdOrderById(id);
    }

    @Override
    public DescriptionDTO saveDescriptionToEntry(DescriptionDTO descriptionDTO, Long id) {
        SubSpecies subSpecies = subSpeciesRepository.findById(id).orElseThrow(() -> new NotFoundException(String.format(SubSpeciesService.SUB_SPECIES_NOT_FOUND_MSG, id)));
        return descriptionService.saveDescriptionToEntry(descriptionDTO, subSpecies);
    }

    @Override
    public void deleteDescriptionFromEntry(Long entryId, Long descriptionId) {
        SubSpecies subSpecies = subSpeciesRepository.findById(entryId).orElseThrow(() -> new NotFoundException(String.format(SubSpeciesService.SUB_SPECIES_NOT_FOUND_MSG, entryId)));
        descriptionService.deleteDescriptionFromEntry(subSpecies, descriptionId);
    }
}
