package com.as.dndwebsite.creatures.types.species;

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
@Qualifier("speciesDescriptionService")
public class SpeciesDescriptionService implements IDescriptionEntryService {
    private final SpeciesRepository speciesRepository;
    private final DescriptionRepository descriptionRepository;
    private final IDescriptionService descriptionService;

    @Override
    public List<DescriptionDTO> getDescriptionsOfEntry(long id) {
        return descriptionRepository.findAllBySpecies_IdOrderById(id);
    }

    @Override
    public DescriptionDTO saveDescriptionToEntry(DescriptionDTO descriptionDTO, Long id) {
        Species species = speciesRepository.findById(id).orElseThrow(() -> new NotFoundException(String.format(SpeciesService.SPECIES_NOT_FOUND_MSG, id)));
        return descriptionService.saveDescriptionToEntry(descriptionDTO, species);
    }

    @Override
    public void deleteDescriptionFromEntry(Long entryId, Long descriptionId) {
        Species species = speciesRepository.findById(entryId).orElseThrow(() -> new NotFoundException(String.format(SpeciesService.SPECIES_NOT_FOUND_MSG, entryId)));
        descriptionService.deleteDescriptionFromEntry(species, descriptionId);
    }
}
