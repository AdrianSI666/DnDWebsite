package com.as.dndwebsite.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

import java.time.ZonedDateTime;

@Getter
public record ApiExceptionData(String message, HttpStatus httpStatus, ZonedDateTime timeStamp) {

}
