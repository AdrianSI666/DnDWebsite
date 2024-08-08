package com.as.dndwebsite.security.refresh;

import com.as.dndwebsite.exception.NotFoundException;
import com.as.dndwebsite.exception.TokenRefreshException;
import com.as.dndwebsite.user.AppUser;
import com.as.dndwebsite.user.AppUserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class RefreshTokenService {
    private final RefreshTokenRepository refreshTokenRepository;
    private final AppUserRepository userRepository;
    private final Clock clock;
    public RefreshToken findByToken(String token) {
        return refreshTokenRepository.findByToken(token).orElseThrow(() -> new NotFoundException("Given refresh token %s doesn't exist.".formatted(token)));
    }

    public RefreshToken createRefreshToken(Long userId) {
        AppUser appUser = userRepository.findById(userId).orElseThrow(() -> new NotFoundException("Can't find user with id: %s".formatted(userId)));
        String uuidToken = UUID.randomUUID().toString();
        while(refreshTokenRepository.findByToken(uuidToken).isPresent()) uuidToken = UUID.randomUUID().toString();
        return refreshTokenRepository.save(new RefreshToken(appUser, uuidToken, new Date(clock.instant().toEpochMilli() + TimeUnit.HOURS.toMillis(24)).toInstant()));
    }

    public void verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token);
            throw new TokenRefreshException(token.getToken(), "Refresh token was expired. Please log in again.");
        }
    }

    public int deleteByUserId(Long userId) {
        AppUser appUser = userRepository.findById(userId).orElseThrow(() -> new NotFoundException("Can't find user with id: %s".formatted(userId)));
        return refreshTokenRepository.deleteByUser(appUser);
    }
}
