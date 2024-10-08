package com.as.dndwebsite.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Clock;
import java.time.Instant;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;

@Service
@Slf4j
public class JwtService {
    private final Clock clock;
    private final SecretKey key;

    public JwtService(Clock clock) {
        this.clock = clock;
        this.key = Jwts.SIG.HS256.key().build();
        log.info(Arrays.toString(key.getEncoded()));
    }

    public String generateToken(
            UserDetails userDetails
    ) {
        return generateToken(new HashMap<>(), userDetails);
    }

    public String generateToken(
            Map<String, Object> extraClaims,
            UserDetails userDetails
    ) {
        Instant time = clock.instant();
        return Jwts.builder()
                .claims()
                .subject(userDetails.getUsername())
                .issuedAt(new Date(time.toEpochMilli()))
                .expiration(new Date(time.toEpochMilli() + TimeUnit.MINUTES.toMillis(1)))
                .add(extraClaims)
                .and()
                .signWith(key, Jwts.SIG.HS256)
                .compact();
    }

    public boolean isTokenValid(String jws, UserDetails userDetails) {
        final String username = extractUsername(jws);
        boolean validDates = extractClaim(jws, Claims::getExpiration).after(extractClaim(jws, Claims::getIssuedAt));
        return (username.equals(userDetails.getUsername())) &&
                !isTokenExpired(jws) &&
                validDates;
    }

    public boolean isTokenValidButExpired(String jws, UserDetails userDetails) {
        final String username = extractUsername(jws);
        boolean validDates = extractClaim(jws, Claims::getExpiration).after(extractClaim(jws, Claims::getIssuedAt));
        return (username.equals(userDetails.getUsername())) &&
                isTokenExpired(jws) &&
                validDates;
    }

    private boolean isTokenExpired(String jws) {
        return extractClaim(jws, Claims::getExpiration).before(new Date(clock.instant().toEpochMilli()));
    }

    public String extractUsername(String jws) {
        return extractClaim(jws, Claims::getSubject);
    }

    public Date extractExpirationTime(String jws) {
        return extractClaim(jws, Claims::getExpiration);
    }

    public <T> T extractClaim(String jws, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(jws);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String jws) {
        try {
            return Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(jws)
                    .getPayload();
        } catch (ExpiredJwtException e) {
            return e.getClaims();
        }
    }

}
