package com.as.dndwebsite.political.kingdom.county;

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

import static com.as.dndwebsite.political.kingdom.county.CountyService.COUNTY_NOT_FOUND_MSG;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
@Qualifier("countyDescriptionService")
public class CountyDescriptionService implements IDescriptionEntryService {
    private final CountyRepository countyRepository;
    private final DescriptionRepository descriptionRepository;
    private final IDescriptionService descriptionService;

    @Override
    public List<DescriptionDTO> getDescriptionsOfEntry(long id) {
        return descriptionRepository.findAllByCounties_IdOrderById(id);
    }

    @Override
    public DescriptionDTO saveDescriptionToEntry(DescriptionDTO descriptionDTO, Long id) {
        County county = countyRepository.findById(id).orElseThrow(() -> new NotFoundException(String.format(COUNTY_NOT_FOUND_MSG, id)));
        return descriptionService.saveDescriptionToEntry(descriptionDTO, county);
    }

    @Override
    public void deleteDescriptionFromEntry(Long entryId, Long descriptionId) {
        County county = countyRepository.findById(entryId).orElseThrow(() -> new NotFoundException(String.format(COUNTY_NOT_FOUND_MSG, entryId)));
        descriptionService.deleteDescriptionFromEntry(county, descriptionId);
    }
}
