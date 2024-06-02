package com.as.dndwebsite.maps.plane.continent.kingdom;

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

import static com.as.dndwebsite.maps.plane.continent.kingdom.KingdomService.KINGDOM_NOT_FOUND_MSG;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
@Qualifier("kingdomDescriptionService")
public class KingdomDescriptionService implements IDescriptionEntryService {
    private final KingdomRepository kingdomRepository;
    private final DescriptionRepository descriptionRepository;
    private final IDescriptionService descriptionService;

    @Override
    public List<DescriptionDTO> getDescriptionsOfEntry(long id) {
        return descriptionRepository.findAllByKingdoms_Id(id);
    }

    @Override
    public DescriptionDTO saveDescriptionToEntry(DescriptionDTO descriptionDTO, Long id) {
        Kingdom kingdom = kingdomRepository.findById(id).orElseThrow(() -> new NotFoundException(String.format(KINGDOM_NOT_FOUND_MSG, id)));
        return descriptionService.saveDescriptionToEntry(descriptionDTO, kingdom);
    }

    @Override
    public void deleteDescriptionFromEntry(Long entryId, Long descriptionId) {
        Kingdom kingdom = kingdomRepository.findById(entryId).orElseThrow(() -> new NotFoundException(String.format(KINGDOM_NOT_FOUND_MSG, entryId)));
        descriptionService.deleteDescriptionFromEntry(kingdom, descriptionId);
    }
}
