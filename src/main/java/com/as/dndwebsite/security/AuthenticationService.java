package com.as.dndwebsite.security;

import com.as.dndwebsite.exception.NotFoundException;
import com.as.dndwebsite.user.AppUser;
import com.as.dndwebsite.user.AppUserRepository;
import com.as.dndwebsite.user.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class AuthenticationService {
    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest registerRequest) {
        AppUser appUser = AppUser.builder()
                .name(registerRequest.name())
                .email(registerRequest.email())
                .password(passwordEncoder.encode(registerRequest.password()))
                .role(Role.USER)
                .blocked(true) //false is blocked
                .enabled(true) //false till they verify email
                .build();
        appUserRepository.save(appUser);
        String jwt = jwtService.generateToken(appUser);
        return new AuthenticationResponse(jwt);
    }

    public AuthenticationResponse login(LoginRequest loginRequest) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                loginRequest.email(),
                loginRequest.password()
        ));
        AppUser appUser = appUserRepository.findByEmail(loginRequest.email())
                .orElseThrow(() -> new NotFoundException("User with email %s not found".formatted(loginRequest.email())));
        String jwt = jwtService.generateToken(appUser);
        return new AuthenticationResponse(jwt);
    }
}
