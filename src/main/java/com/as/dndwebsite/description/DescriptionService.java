package com.as.dndwebsite.description;

import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.dto.DescriptionDTO;
import com.as.dndwebsite.exception.NotFoundException;
import com.as.dndwebsite.mappers.DomainMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class DescriptionService implements IDescriptionService {
    private final DescriptionRepository descriptionRepository;
    private final DomainMapper<Description, DescriptionDTO> domainMapper;
    public static final String DESCRIPTION_NOT_FOUND_MSG =
            "Description with id %s not found";
    @Override
    public DescriptionDTO saveDescriptionToEntry(DescriptionDTO descriptionDTO, Entry entry) {
        Description description = new Description(descriptionDTO.text());
        entry.getDescriptions().add(description);
        return domainMapper.map(descriptionRepository.save(description));
    }

    @Override
    public DescriptionDTO updateDescription(DescriptionDTO descriptionDTO, Long descriptionId) {
        Description oldDescription = descriptionRepository.findById(descriptionId).orElseThrow(() -> new NotFoundException(DESCRIPTION_NOT_FOUND_MSG.formatted(descriptionId)));
        oldDescription.setText(descriptionDTO.text());
        return domainMapper.map(oldDescription);
    }

    @Override
    public void deleteDescriptionFromEntry(Entry entry, Long descriptionId) {
        Description description = descriptionRepository.findById(descriptionId).orElseThrow(() -> new NotFoundException(DESCRIPTION_NOT_FOUND_MSG.formatted(descriptionId)));
        entry.getDescriptions().remove(description);
        descriptionRepository.delete(description);
    }
}
