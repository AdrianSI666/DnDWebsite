package com.as.dndwebsite.util;

import org.springframework.data.domain.Page;

import java.util.Map;

public interface IPageMapper {
    <T> Map<String, Object> convertDataFromPageToMap(Page<T> dataDTOPage);
}
