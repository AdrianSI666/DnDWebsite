package com.as.dndwebsite.security;

import com.as.dndwebsite.security.dto.AuthenticationResponse;
import com.as.dndwebsite.security.dto.LoginRequest;
import com.as.dndwebsite.security.dto.RegisterRequest;
import com.as.dndwebsite.security.dto.TokenRefreshRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest registerRequest) {
        return ResponseEntity.ok(authenticationService.register(registerRequest));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(authenticationService.login(loginRequest));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthenticationResponse> refreshToken(@RequestBody TokenRefreshRequest request) {
        return ResponseEntity.ok(authenticationService.refresh(request));
    }

    @PutMapping("/signout/{userId}")
    public ResponseEntity<HttpStatus> signOut(@AuthenticationPrincipal(errorOnInvalidType = true) UserDetails userDetails, @PathVariable("userId") Long userId) {
        authenticationService.signOut(userId, userDetails);
        return ResponseEntity.ok().build();
    }
}
