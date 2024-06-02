package com.as.dndwebsite.description;

import com.as.dndwebsite.dto.DescriptionDTO;

import java.util.List;

public interface IDescriptionEntryService {
    List<DescriptionDTO> getDescriptionsOfEntry(long id);

    DescriptionDTO saveDescriptionToEntry(DescriptionDTO descriptionDTO, Long id);

    void deleteDescriptionFromEntry(Long entryId, Long descriptionId);
}
