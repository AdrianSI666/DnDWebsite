package com.as.dndwebsite.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.ZoneId;
import java.time.ZonedDateTime;

@ControllerAdvice
public class GeneralExceptionHandler {
    @ExceptionHandler(value = {Exception.class})
    public ResponseEntity<Object> handleApiRequestException(Exception e) {
        HttpStatus errorStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        String message = "Unexpected Error";
        if (e instanceof DataIntegrityViolationException) {
            errorStatus = HttpStatus.CONFLICT;
            message = "Your request violated unique constraint.";
        }
        ApiException apiException = new ApiException(
                message,
                errorStatus,
                ZonedDateTime.now(ZoneId.of("Z"))
        );
        return new ResponseEntity<>(apiException, errorStatus);
    }
}
