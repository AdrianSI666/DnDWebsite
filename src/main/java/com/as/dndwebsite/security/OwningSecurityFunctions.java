package com.as.dndwebsite.security;

import com.as.dndwebsite.exception.ForbiddenException;
import com.as.dndwebsite.exception.UnAuthorizedException;
import com.as.dndwebsite.user.AppUser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
@Slf4j
public class OwningSecurityFunctions {
    public void checkIfLoggedInUserIsTheSameAsAuthor(AppUser authorUserName, String actionName, Long objectId) {
        String loggedInUserName = this.getLoggedInUserName(actionName, objectId);
        if (!Objects.equals(authorUserName.getUsername(), loggedInUserName))
            throw new ForbiddenException(loggedInUserName, authorUserName);
    }

    public void checkIfLoggedInUserAndGivenIdIsTheSame(String actionName, Long givenId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if ((authentication instanceof AnonymousAuthenticationToken)) {
            throw new UnAuthorizedException("Not authorized action %s on id %d".formatted(actionName, givenId));
        }
        AppUser userDetails = (AppUser) authentication.getPrincipal();

        if (!Objects.equals(givenId, userDetails.getId()))
            throw new ForbiddenException(userDetails.getId().toString(), userDetails);
    }

    public boolean isLoggedInUserAnAuthor(AppUser authorUserName, String actionName, Long objectId) {
        String loggedInUserName = this.getLoggedInUserName(actionName, objectId);
        return Objects.equals(authorUserName.getUsername(), loggedInUserName);
    }

    private String getLoggedInUserName(String actionName, Long objectId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if ((authentication instanceof AnonymousAuthenticationToken)) {
            throw new UnAuthorizedException("Not authorized action %s on id %d".formatted(actionName, objectId));
        }
        return authentication.getName();
    }
}
