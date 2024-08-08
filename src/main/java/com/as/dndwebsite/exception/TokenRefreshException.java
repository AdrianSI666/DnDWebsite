package com.as.dndwebsite.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
@Slf4j
public class TokenRefreshException extends RuntimeException {
    public TokenRefreshException(String token, String message) {
        super(message);
        log.warn("Token %s failed to refresh".formatted(token));
    }
}
