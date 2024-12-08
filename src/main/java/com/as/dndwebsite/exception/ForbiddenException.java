package com.as.dndwebsite.exception;

import com.as.dndwebsite.user.AppUser;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class ForbiddenException extends RuntimeException{
    public ForbiddenException(String pearsonTryingToUserName, AppUser toWho) {
        super("You don't have access to this operation.");
        log.error("Somebody {} tried to use his permissions to change users' {} data.", pearsonTryingToUserName, toWho.getEmail());
    }
}
