package com.as.dndwebsite.dto;

public record PageInfo(
        Integer number,
        Integer size
) {
    @Override
    public Integer number() {
        return number == null ? 1 : number;
    }

    @Override
    public Integer size() {
        return size== null ? 30 : size;
    }
}
