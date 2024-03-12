package com.as.dndwebsite.dto;

import java.util.Collection;

public record PageDTO<T>(int currentPage,
                         Collection<T> data,
                         int totalPages) {
}
