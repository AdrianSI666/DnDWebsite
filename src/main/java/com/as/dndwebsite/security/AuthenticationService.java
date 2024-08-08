package com.as.dndwebsite.security;

import com.as.dndwebsite.exception.NotFoundException;
import com.as.dndwebsite.exception.TokenAuthenticationException;
import com.as.dndwebsite.security.dto.AuthenticationResponse;
import com.as.dndwebsite.security.dto.LoginRequest;
import com.as.dndwebsite.security.dto.RegisterRequest;
import com.as.dndwebsite.security.dto.TokenRefreshRequest;
import com.as.dndwebsite.security.jwt.JwtService;
import com.as.dndwebsite.security.refresh.RefreshToken;
import com.as.dndwebsite.security.refresh.RefreshTokenService;
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
    private final RefreshTokenService refreshTokenService;
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
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(appUser.getId());
        return new AuthenticationResponse(jwt, refreshToken.getToken(), appUser.getId());
    }

    public AuthenticationResponse login(LoginRequest loginRequest) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                loginRequest.email(),
                loginRequest.password()
        ));
        AppUser appUser = appUserRepository.findByEmail(loginRequest.email())
                .orElseThrow(() -> new NotFoundException("User with email %s not found".formatted(loginRequest.email())));
        String jwt = jwtService.generateToken(appUser);
        refreshTokenService.deleteByUserId(appUser.getId());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(appUser.getId());
        return new AuthenticationResponse(jwt, refreshToken.getToken(), appUser.getId());
    }

    public AuthenticationResponse refresh(TokenRefreshRequest tokenRefreshRequest) {
        String email = jwtService.extractUsername(tokenRefreshRequest.token());
        AppUser appUser = appUserRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User with email %s not found".formatted(email)));
        if(jwtService.isTokenValid(tokenRefreshRequest.token(), appUser)){
            RefreshToken refreshToken = refreshTokenService.findByToken(tokenRefreshRequest.refreshToken());
            if(refreshToken.getUser().equals(appUser)) {
                refreshTokenService.verifyExpiration(refreshToken);
                refreshTokenService.deleteByUserId(appUser.getId());
                RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(appUser.getId());
                String jwt = jwtService.generateToken(appUser);
                return new AuthenticationResponse(jwt, newRefreshToken.getToken(), appUser.getId());
            }
        }
        throw new TokenAuthenticationException(tokenRefreshRequest.refreshToken(), "Failed to authenticate");
    }
}
