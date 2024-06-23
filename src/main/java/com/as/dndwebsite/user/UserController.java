package com.as.dndwebsite.user;

import com.as.dndwebsite.user.DTOs.UserCreateDTO;
import com.as.dndwebsite.user.DTOs.UserInfoDTO;
import com.as.dndwebsite.user.DTOs.UserPublicDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    private final IUserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;
    @GetMapping("/all")
    public ResponseEntity<List<UserInfoDTO>> getAllUsers(){
        return ResponseEntity.ok().body(userService.getAllUsers());
    }


    @PostMapping("/register")
    public ResponseEntity<UserPublicDTO> saveUser(@RequestBody UserCreateDTO ucDTO){
        ucDTO.setPassword(passwordEncoder.encode(ucDTO.getPassword()));
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.saveUser(ucDTO));
    }

}
