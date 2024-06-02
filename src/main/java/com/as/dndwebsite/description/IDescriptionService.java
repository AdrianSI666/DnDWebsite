package com.as.dndwebsite.description;

import com.as.dndwebsite.domain.Entry;
import com.as.dndwebsite.dto.DescriptionDTO;

public interface IDescriptionService {
    DescriptionDTO saveDescriptionToEntry(DescriptionDTO descriptionDTO, Entry entry);
    DescriptionDTO updateDescription(DescriptionDTO descriptionDTO, Long descriptionId);
    void deleteDescriptionFromEntry(Entry entry, Long descriptionId);
}
