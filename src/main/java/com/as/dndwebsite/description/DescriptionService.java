package com.as.dndwebsite.description;

import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.dto.DescriptionDTO;
import com.as.dndwebsite.exception.NotFoundException;
import com.as.dndwebsite.mappers.DomainMapper;
import com.as.dndwebsite.security.OwningSecurityFunctions;
import com.as.dndwebsite.world.World;
import com.as.dndwebsite.world.WorldRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.as.dndwebsite.world.WorldService.WORLD_NOT_FOUND_MSG;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class DescriptionService implements IDescriptionService {
    private final DescriptionRepository descriptionRepository;
    private final DomainMapper<Description, DescriptionDTO> domainMapper;
    public static final String DESCRIPTION_NOT_FOUND_MSG =
            "Description with id %s not found";
    private final OwningSecurityFunctions owningSecurityFunctions;
    private final WorldRepository worldRepository;

    @Override
    public DescriptionDTO saveDescriptionToEntry(DescriptionDTO descriptionDTO, Entry entry) {
        owningSecurityFunctions.checkIfLoggedInUserIsTheSameAsAuthor(entry.getWorld().getAuthor(), "Save new description", entry.getWorld().getId());
        Description description = new Description(descriptionDTO.title(), descriptionDTO.text());
        entry.getDescriptions().add(description);
        return domainMapper.map(descriptionRepository.save(description));
    }

    @Override
    public DescriptionDTO updateDescription(DescriptionDTO descriptionDTO, Long descriptionId, Long worldId) {
        World world = worldRepository.findById(worldId).orElseThrow(
                () -> new NotFoundException(String.format(WORLD_NOT_FOUND_MSG, worldId)));
        owningSecurityFunctions.checkIfLoggedInUserIsTheSameAsAuthor(world.getAuthor(), "Save new culture", world.getId());
        Description oldDescription = descriptionRepository.findById(descriptionId).orElseThrow(() -> new NotFoundException(DESCRIPTION_NOT_FOUND_MSG.formatted(descriptionId)));
        oldDescription.setTitle(descriptionDTO.title());
        oldDescription.setText(descriptionDTO.text());
        return domainMapper.map(oldDescription);
    }

    @Override
    public void deleteDescriptionFromEntry(Entry entry, Long descriptionId) {
        owningSecurityFunctions.checkIfLoggedInUserIsTheSameAsAuthor(entry.getWorld().getAuthor(), "Delete description", entry.getId());
        Description description = descriptionRepository.findById(descriptionId).orElseThrow(() -> new NotFoundException(DESCRIPTION_NOT_FOUND_MSG.formatted(descriptionId)));
        entry.getDescriptions().remove(description);
        descriptionRepository.delete(description);
    }

    @Override
    public DescriptionDTO saveDescriptionToWorld(DescriptionDTO descriptionDTO, World world) {
        owningSecurityFunctions.checkIfLoggedInUserIsTheSameAsAuthor(world.getAuthor(), "Save new description", world.getId());
        Description description = new Description(descriptionDTO.title(), descriptionDTO.text());
        world.getDescriptions().add(description);
        return domainMapper.map(descriptionRepository.save(description));
    }

    @Override
    public void deleteDescriptionFromWorld(World world, Long descriptionId) {
        owningSecurityFunctions.checkIfLoggedInUserIsTheSameAsAuthor(world.getAuthor(), "Delete description", world.getId());
        Description description = descriptionRepository.findById(descriptionId).orElseThrow(() -> new NotFoundException(DESCRIPTION_NOT_FOUND_MSG.formatted(descriptionId)));
        world.getDescriptions().remove(description);
        descriptionRepository.delete(description);
    }
}
