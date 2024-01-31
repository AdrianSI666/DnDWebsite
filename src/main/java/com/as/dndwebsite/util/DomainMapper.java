package com.as.dndwebsite.util;

public interface DomainMapper<T, S> {
    S map(T source);
}
