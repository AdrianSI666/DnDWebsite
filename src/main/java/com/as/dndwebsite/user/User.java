package com.as.dndwebsite.user;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.ZonedDateTime;
@Getter
@Setter
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id",updatable = false,nullable = false,unique = true)
    private Long id;

    @NotBlank
    @Size(min = 3,max = 35)
    @Column(name = "user_name",unique = true,nullable = false)
    private String userName;

    @Email
    @Column(name = "email",unique = true,nullable = false)
    private String email;

    @NotBlank
    @Size(min = 8)
    @Column(name = "password",nullable = false)
    private String password;

    @CreationTimestamp
    @Column(name="created_at",updatable = false,columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private ZonedDateTime createdAt;

    @Column(name = "is_verified",columnDefinition = "boolean default true")
    private boolean isVerified = true; //temporary, should be "false" by default

    @Column(name = "is_enable",columnDefinition = "boolean default true")
    private boolean isEnabled = true;

    public User(String userName, String email, String password) {
            this.userName = userName;
            this.email = email;
            this.password = password;
    }
}
