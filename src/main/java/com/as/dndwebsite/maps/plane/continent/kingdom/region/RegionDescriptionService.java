package com.as.dndwebsite.maps.plane.continent.kingdom.region;

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

import static com.as.dndwebsite.maps.plane.continent.kingdom.region.RegionService.REGION_NOT_FOUND_MSG;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
@Qualifier("regionDescriptionService")
public class RegionDescriptionService implements IDescriptionEntryService {
    private final RegionRepository regionRepository;
    private final DescriptionRepository descriptionRepository;
    private final IDescriptionService descriptionService;

    @Override
    public List<DescriptionDTO> getDescriptionsOfEntry(long id) {
        return descriptionRepository.findAllByRegions_Id(id);
    }

    @Override
    public DescriptionDTO saveDescriptionToEntry(DescriptionDTO descriptionDTO, Long id) {
        Region region = regionRepository.findById(id).orElseThrow(() -> new NotFoundException(String.format(REGION_NOT_FOUND_MSG, id)));
        return descriptionService.saveDescriptionToEntry(descriptionDTO, region);
    }

    @Override
    public void deleteDescriptionFromEntry(Long entryId, Long descriptionId) {
        Region region = regionRepository.findById(entryId).orElseThrow(() -> new NotFoundException(String.format(REGION_NOT_FOUND_MSG, entryId)));
        descriptionService.deleteDescriptionFromEntry(region, descriptionId);
    }
}
