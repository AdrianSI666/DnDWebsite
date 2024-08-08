package com.as.dndwebsite.exception;

import io.jsonwebtoken.ExpiredJwtException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.time.ZoneId;
import java.time.ZonedDateTime;

@ControllerAdvice
@Slf4j
public class TokenControllerAdvice extends ResponseEntityExceptionHandler {
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
    @ResponseStatus(value = HttpStatus.PRECONDITION_FAILED)
    public ResponseEntity<Object> handleTokenExpiredException(ExpiredJwtException ex) {
        HttpStatus preconditionFailed = HttpStatus.PRECONDITION_FAILED;
        log.warn("failed:" + preconditionFailed.name());
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

    @ExceptionHandler({ ResponseStatusException.class })
    public ResponseEntity<Object> handleAccessDeniedException(
            Exception ex, WebRequest request) {
        return new ResponseEntity<Object>(
                "Access denied message here", new HttpHeaders(), HttpStatus.I_AM_A_TEAPOT);
    }
}
