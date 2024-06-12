package com.as.dndwebsite.bestiary;

import com.as.dndwebsite.description.DescriptionRepository;
import com.as.dndwebsite.description.IDescriptionEntryService;
import com.as.dndwebsite.description.IDescriptionService;
import com.as.dndwebsite.dto.DescriptionDTO;
import com.as.dndwebsite.exception.NotFoundException;
import com.as.dndwebsite.race.Race;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.as.dndwebsite.bestiary.BeastService.BEAST_NOT_FOUND_MSG;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
@Qualifier("bestDescriptionService")
public class BeastDescriptionService implements IDescriptionEntryService {
    private final BeastRepository beastRepository;
    private final DescriptionRepository descriptionRepository;
    private final IDescriptionService descriptionService;
    @Override
    public List<DescriptionDTO> getDescriptionsOfEntry(long id) {
        return descriptionRepository.findAllByBeasts_IdOrderById(id);
    }

    @Override
    public DescriptionDTO saveDescriptionToEntry(DescriptionDTO descriptionDTO, Long id) {
        Beast beast = beastRepository.findById(id).orElseThrow(
                () -> new NotFoundException(
                        String.format(BEAST_NOT_FOUND_MSG,id)));
        return descriptionService.saveDescriptionToEntry(descriptionDTO,beast);
    }

    @Override
    public void deleteDescriptionFromEntry(Long entryId, Long descriptionId) {
        Beast beast =
                beastRepository.findById(entryId).orElseThrow(
                        () -> new NotFoundException(
                                String.format(BEAST_NOT_FOUND_MSG,entryId)));
        descriptionService.deleteDescriptionFromEntry(beast,descriptionId);
    }
}
