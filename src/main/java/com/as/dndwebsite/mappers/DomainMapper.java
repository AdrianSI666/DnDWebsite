package com.as.dndwebsite.mappers;

public interface DomainMapper<T, S> {
    S map(T source);
}
