package com.as.dndwebsite.util;

import com.as.dndwebsite.dto.PageDTO;
import org.springframework.data.domain.Page;

public interface IPageMapper {
    <T> PageDTO<T> mapPageDataToPageDTO(Page<T> dataDTOPage);
}
