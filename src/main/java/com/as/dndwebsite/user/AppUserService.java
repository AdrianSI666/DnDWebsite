package com.as.dndwebsite.user;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class AppUserService implements UserDetailsService {
    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AppUser user = appUserRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException(username));
//        UserDetails userDetails = User.builder()
//                .username(user.getUsername())
//                .password(user.getPassword())
//                .passwordEncoder(passwordEncoder::encode)
//                .disabled(user.isBlocked())
//                .roles(user.getAuthorities().stream().map((grantedAuthority -> grantedAuthority.getAuthority())).toList());
        return user;
    }
}
