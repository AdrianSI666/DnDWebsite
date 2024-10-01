package com.as.dndwebsite.geographic.plane.continent;

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

import static com.as.dndwebsite.geographic.plane.continent.ContinentService.CONTINENT_NOT_FOUND_MSG;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
@Qualifier("continentDescriptionService")
public class ContinentDescriptionService implements IDescriptionEntryService {
    private final ContinentRepository continentRepository;
    private final DescriptionRepository descriptionRepository;
    private final IDescriptionService descriptionService;

    @Override
    public List<DescriptionDTO> getDescriptionsOfEntry(long id) {
        return descriptionRepository.findAllByContinents_Id(id);
    }

    @Override
    public DescriptionDTO saveDescriptionToEntry(DescriptionDTO descriptionDTO, Long id) {
        Continent continent = continentRepository.findById(id).orElseThrow(() -> new NotFoundException(String.format(CONTINENT_NOT_FOUND_MSG, id)));
        return descriptionService.saveDescriptionToEntry(descriptionDTO, continent);
    }

    @Override
    public void deleteDescriptionFromEntry(Long entryId, Long descriptionId) {
        Continent continent = continentRepository.findById(entryId).orElseThrow(() -> new NotFoundException(String.format(CONTINENT_NOT_FOUND_MSG, entryId)));
        descriptionService.deleteDescriptionFromEntry(continent, descriptionId);
    }
}
