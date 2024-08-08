package com.as.dndwebsite.security.jwt;

import com.as.dndwebsite.exception.TokenControllerAdvice;
import com.as.dndwebsite.exception.TokenRefreshException;
import com.auth0.jwt.JWT;
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.interfaces.DecodedJWT;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;
import java.time.Clock;
import java.util.Date;

@RequiredArgsConstructor
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final UserDetailsService userService;
    private final TokenControllerAdvice tokenControllerAdvice;
    @Qualifier("handlerExceptionResolver")
    private final HandlerExceptionResolver resolver;
    private final Clock clock;
    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        if(authHeader == null || !authHeader.startsWith("Bearer")) {
            filterChain.doFilter(request, response);
            return;
        }
        final String jwt = authHeader.substring(7);
        try {
            DecodedJWT decodedJWT = JWT.decode(jwt);
            Date expiresAt = decodedJWT.getExpiresAt();
            if(expiresAt.before(new Date())) {
                filterChain.doFilter(request, response);
            }
        } catch (JWTDecodeException e) {
            // ...
        }
        try {
            final String userEmail = jwtService.extractUsername(jwt);
            if(userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userService.loadUserByUsername(userEmail);
                if(jwtService.isTokenValid(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    authToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request)
                    );
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        }catch (ExpiredJwtException e) {
//            tokenControllerAdvice.handleTokenExpiredException(e);
//            response.setStatus(412);
//            response.sendError(412, "test");
//            filterChain.doFilter(request, response);
//            resolver.resolveException(request, response, tokenControllerAdvice, e);
//            throw new ResponseStatusException(
//                    HttpStatus.PRECONDITION_FAILED, "Test", e);
//            return;
            response.reset(); // Reset the response to prevent partial data being sent
            response.setContentType("application/json");
            response.setStatus(HttpServletResponse.SC_PRECONDITION_FAILED);
            response.getWriter().write("{ \"error\": \"Precondition failed!\", \"message\": \"" + e.getMessage() + "\" }");
            return;
        }
        filterChain.doFilter(request, response);
    }
}
