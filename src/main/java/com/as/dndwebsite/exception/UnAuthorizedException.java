package com.as.dndwebsite.exception;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class UnAuthorizedException extends RuntimeException {
    public UnAuthorizedException(String toWhatOperation) {
        super("You need to log in to access this operation.");
        log.error("Somebody tried to use action {} without logging in.", toWhatOperation);
    }
}
