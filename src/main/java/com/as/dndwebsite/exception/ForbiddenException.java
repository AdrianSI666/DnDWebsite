package com.as.dndwebsite.exception;

import com.as.dndwebsite.user.AppUser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;

@Slf4j
public class ForbiddenException extends RuntimeException{
    public ForbiddenException(UserDetails who, AppUser toWho) {
        super("Unnatural access request");
        log.error("Somebody {} tried to sign off user {}", who.getUsername(), toWho.getEmail());
    }
}
