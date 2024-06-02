package com.as.dndwebsite.mappers;

import com.as.dndwebsite.dto.PageDTO;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

@Component
public class PageMapper implements IPageMapper {
    @Override
    public <T> PageDTO<T> mapPageDataToPageDTO(Page<T> dataDTOPage) {
        return new PageDTO<>(dataDTOPage.getNumber() + 1,
                dataDTOPage.getContent(),
                dataDTOPage.getTotalPages());
    }
}
