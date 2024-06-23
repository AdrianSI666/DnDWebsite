package com.as.dndwebsite.user;

import com.as.dndwebsite.user.DTOs.UserCreateDTO;
import com.as.dndwebsite.user.DTOs.UserInfoDTO;
import com.as.dndwebsite.user.DTOs.UserPublicDTO;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IUserService {

    UserInfoDTO getUser(String userName);
    UserPublicDTO saveUser(UserCreateDTO user);
    void updateUser(UserInfoDTO user, Long id);
    void deleteUser(long id);

    List<UserInfoDTO> getAllUsers();
}
