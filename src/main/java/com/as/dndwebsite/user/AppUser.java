package com.as.dndwebsite.user;

import com.as.dndwebsite.world.World;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.Serial;
import java.util.Collection;
import java.util.List;

@Entity
@Getter
@Setter
@ToString
@RequiredArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "_user", schema = "public")
public class AppUser implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true, nullable = false)
    private String name;
    @Column(unique = true, nullable = false)
    private String email;
    @Column(nullable = false)
    @JsonIgnore
    private String password;
    private boolean enabled;
    private boolean blocked;
    @Enumerated(EnumType.STRING)
    private Role role;
    @OneToMany
    private Collection<World> worlds;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return blocked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }

    @Serial
    private void writeObject(ObjectOutputStream out) throws IOException {
        out.writeObject(id);
        out.writeObject(name);
        out.writeObject(email);
        out.writeObject(password);
        out.writeBoolean(enabled);
        out.writeBoolean(blocked);
        out.writeObject(role);
        out.writeObject(null);
    }

    @Serial
    private void readObject(ObjectInputStream in) throws IOException, ClassNotFoundException {
        in.defaultReadObject();
        id = (Long) in.readObject();
        name = (String) in.readObject();
        email = (String) in.readObject();
        password = (String) in.readObject();
        enabled = in.readBoolean();
        blocked = in.readBoolean();
        role = (Role) in.readObject();
        worlds = null;
    }
}
