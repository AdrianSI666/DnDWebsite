package com.as.dndwebsite.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
@Slf4j
public class TokenAuthenticationException extends RuntimeException {
    public TokenAuthenticationException(String token, String message) {
        super(message);
        log.error("Token %s failed to authenticate".formatted(token));
    }
}
