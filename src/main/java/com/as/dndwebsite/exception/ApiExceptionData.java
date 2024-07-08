package com.as.dndwebsite.exception;

import org.springframework.http.HttpStatus;

import java.time.ZonedDateTime;

public record ApiExceptionData(String message, HttpStatus httpStatus, ZonedDateTime timeStamp) {
}
