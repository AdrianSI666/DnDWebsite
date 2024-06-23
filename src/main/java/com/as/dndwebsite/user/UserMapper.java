package com.as.dndwebsite.user;


import com.as.dndwebsite.mappers.DomainMapper;
import com.as.dndwebsite.user.DTOs.UserCreateDTO;
import com.as.dndwebsite.user.DTOs.UserInfoDTO;
import com.as.dndwebsite.user.DTOs.UserPublicDTO;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    public User toUser(UserCreateDTO userDTO){
        return new User(userDTO.getUserName(), userDTO.getEmail(), userDTO.getPassword());
    }

    public UserPublicDTO userDTOToPublicDTO(UserInfoDTO uDTO){
        return new UserPublicDTO(uDTO.userName(), uDTO.isEnabled());
    }

    public UserInfoDTO userToUserInfoDTO(User user) {
        return new UserInfoDTO(user.getId(), user.getUserName(), user.getEmail(), user.getPassword(), user.getCreatedAt(), user.isVerified(), user.isEnabled());
    }
    public UserPublicDTO newUserToPublicDTO(User user){
        return new UserPublicDTO(user.getUserName(), user.isEnabled());
    }



}
