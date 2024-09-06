package com.as.dndwebsite.security;

import com.as.dndwebsite.exception.ForbiddenException;
import com.as.dndwebsite.exception.NotFoundException;
import com.as.dndwebsite.exception.TokenAuthenticationException;
import com.as.dndwebsite.exception.UniqueConstrainException;
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
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;

@Slf4j
@RequiredArgsConstructor
@Service
public class AuthenticationService {
    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final RefreshTokenService refreshTokenService;

    public AuthenticationResponse register(RegisterRequest registerRequest) {
        if (appUserRepository.findByName(registerRequest.name()).isPresent())
            throw new UniqueConstrainException("Username already exists");
        if (appUserRepository.findByEmail(registerRequest.email()).isPresent())
            throw new UniqueConstrainException("Account for this email already exists");
        AppUser appUser = AppUser.builder()
                .name(registerRequest.name())
                .email(registerRequest.email())
                .password(passwordEncoder.encode(registerRequest.password()))
                .role(Role.USER)
                .blocked(true) //false is blocked
                .enabled(true) //false till they verify email //TODO Email validation
                .build();
        appUserRepository.save(appUser);
        String jwt = jwtService.generateToken(appUser);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(appUser.getId());
        Date exp = jwtService.extractExpirationTime(jwt);
        return new AuthenticationResponse(jwt, refreshToken.getToken(), appUser.getId(), exp.toInstant().toEpochMilli());
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
        Date exp = jwtService.extractExpirationTime(jwt);
        return new AuthenticationResponse(jwt, refreshToken.getToken(), appUser.getId(), exp.toInstant().toEpochMilli());
    }

    public AuthenticationResponse refresh(TokenRefreshRequest tokenRefreshRequest) {
        String email = jwtService.extractUsername(tokenRefreshRequest.token());
        AppUser appUser = appUserRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User with email %s not found".formatted(email)));
        if (jwtService.isTokenValidButExpired(tokenRefreshRequest.token(), appUser)) {
            RefreshToken refreshToken = refreshTokenService.findByToken(tokenRefreshRequest.refreshToken());
            if (refreshToken.getUser().equals(appUser)) {
                refreshTokenService.verifyExpiration(refreshToken);
                refreshTokenService.deleteByUserId(appUser.getId());
                RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(appUser.getId());
                String jwt = jwtService.generateToken(appUser);
                Date exp = jwtService.extractExpirationTime(jwt);
                return new AuthenticationResponse(jwt, newRefreshToken.getToken(), appUser.getId(), exp.toInstant().toEpochMilli());
            }
        }
        throw new TokenAuthenticationException(tokenRefreshRequest.refreshToken(), "Failed to authenticate");
    }

    public void signOut(Long userId, UserDetails userDetails) {
        AppUser appUser = appUserRepository.findById(userId).orElseThrow(() -> new NotFoundException("Couldn't find user to log out."));
        if (!appUser.getEmail().equals(userDetails.getUsername())) {
            throw new ForbiddenException(userDetails, appUser);
        }
        refreshTokenService.deleteByUserId(userId);
    }
}
