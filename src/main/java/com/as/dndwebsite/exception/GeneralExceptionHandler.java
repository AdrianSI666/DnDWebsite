package com.as.dndwebsite.exception;

import io.jsonwebtoken.ExpiredJwtException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.time.ZoneId;
import java.time.ZonedDateTime;

@ControllerAdvice
@Slf4j
public class GeneralExceptionHandler {
    @ExceptionHandler(value = {Exception.class})
    public ResponseEntity<Object> handleApiRequestException(Exception e) {
        HttpStatus errorStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        String message = "Unexpected Error";
        if (e instanceof DataIntegrityViolationException) {
            errorStatus = HttpStatus.CONFLICT;
            message = "Your request violated unique constraint.";
        }
        ApiExceptionData apiException = new ApiExceptionData(
                message,
                errorStatus,
                ZonedDateTime.now(ZoneId.of("Z"))
        );
        return new ResponseEntity<>(apiException, errorStatus);
    }

    @ExceptionHandler(value = {BadRequestException.class})
    public ResponseEntity<Object> handleBadRequestException(BadRequestException e){
        HttpStatus badRequest = HttpStatus.BAD_REQUEST;
        ApiExceptionData apiException = new ApiExceptionData(
                e.getMessage(),
                badRequest,
                ZonedDateTime.now(ZoneId.of("Z"))
        );
        return new ResponseEntity<>(apiException, badRequest);
    }

    @ExceptionHandler(value = {NotFoundException.class})
    public ResponseEntity<Object> handleNotFoundException(NotFoundException e){
        HttpStatus badRequest = HttpStatus.NOT_FOUND;
        ApiExceptionData apiException = new ApiExceptionData(
                e.getMessage(),
                badRequest,
                ZonedDateTime.now(ZoneId.of("Z"))
        );
        return new ResponseEntity<>(apiException, badRequest);
    }

    @ExceptionHandler(value = {UniqueConstrainException.class})
    public ResponseEntity<Object> handleUniqueConstrainException(UniqueConstrainException e){
        HttpStatus badRequest = HttpStatus.CONFLICT;
        ApiExceptionData apiException = new ApiExceptionData(
                e.getMessage(),
                badRequest,
                ZonedDateTime.now(ZoneId.of("Z"))
        );
        return new ResponseEntity<>(apiException, badRequest);
    }

    @ExceptionHandler(value = BadCredentialsException.class)
    public ResponseEntity<Object> handleBadCredentialsException(BadCredentialsException e) {
        HttpStatus preconditionFailed = HttpStatus.PRECONDITION_FAILED;
        ApiExceptionData apiException = new ApiExceptionData(
                "Bad password.",
                preconditionFailed,
                ZonedDateTime.now(ZoneId.of("Z"))
        );
        return new ResponseEntity<>(apiException, preconditionFailed);
    }

    @ExceptionHandler(value = TokenRefreshException.class)
    public ResponseEntity<Object> handleTokenRefreshException(TokenRefreshException ex) {
        HttpStatus forbidden = HttpStatus.FORBIDDEN;
        ApiExceptionData apiException = new ApiExceptionData(
                ex.getMessage(),
                forbidden,
                ZonedDateTime.now(ZoneId.of("Z"))
        );
        return new ResponseEntity<>(apiException, forbidden);
    }

    @ExceptionHandler(value = ExpiredJwtException.class)
    public ResponseEntity<Object> handleTokenExpiredException(ExpiredJwtException ex) {
        HttpStatus preconditionFailed = HttpStatus.PRECONDITION_FAILED;
        log.warn("failed:" + preconditionFailed.name() + " " + ex.getMessage());
        ApiExceptionData apiException = new ApiExceptionData(
                "Access token expired",
                preconditionFailed,
                ZonedDateTime.now(ZoneId.of("Z"))
        );
        return new ResponseEntity<>(apiException, preconditionFailed);
    }

    @ExceptionHandler(value = TokenAuthenticationException.class)
    public ResponseEntity<Object> handleTokenAuthenticationException(TokenRefreshException ex) {
        HttpStatus forbidden = HttpStatus.FORBIDDEN;
        ApiExceptionData apiException = new ApiExceptionData(
                "You don't have permission for this action.",
                forbidden,
                ZonedDateTime.now(ZoneId.of("Z"))
        );
        return new ResponseEntity<>(apiException, forbidden);
    }

    @ExceptionHandler(value = ForbiddenException.class)
    public ResponseEntity<Object> handleForbiddenException(ForbiddenException e) {
        HttpStatus forbidden = HttpStatus.FORBIDDEN;
        ApiExceptionData apiException = new ApiExceptionData(
                "You don't have permission for this action.",
                forbidden,
                ZonedDateTime.now(ZoneId.of("Z"))
        );
        return new ResponseEntity<>(apiException, forbidden);
    }
}
