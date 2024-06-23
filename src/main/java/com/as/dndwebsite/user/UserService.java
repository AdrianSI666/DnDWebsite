package com.as.dndwebsite.user;


import com.as.dndwebsite.exception.NotFoundException;
import com.as.dndwebsite.mappers.DomainMapper;
import com.as.dndwebsite.user.DTOs.UserCreateDTO;

import com.as.dndwebsite.user.DTOs.UserInfoDTO;
import com.as.dndwebsite.user.DTOs.UserPublicDTO;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.NotImplementedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class UserService implements IUserService{
    @Autowired
    private final UserRepository userRepository;
    public static final String USER_NOT_FOUND_MSG = "user with name %s not found";
    private final UserMapper mapper;

    @Override
    public UserInfoDTO getUser(String userName) {
        log.info("Getting user");
        return mapper.userToUserInfoDTO(userRepository.findUserByUserName(userName).orElseThrow(
                () -> new NotFoundException(
                        String.format(USER_NOT_FOUND_MSG,userName)
                )
        ));
    }


    @Override
    public UserPublicDTO saveUser(UserCreateDTO user) {
        log.info("Saving new user {}", user.getUserName());
        User saveUser = userRepository.save(new User(user.getUserName(), user.getEmail(), user.getPassword()));
        return mapper.newUserToPublicDTO(saveUser);
    }

    @Override
    public void updateUser(UserInfoDTO user, Long id) {
        throw new NotImplementedException("work in progress");
    }

    @Override
    public void deleteUser(long id) {
        throw new NotImplementedException("work in progress");
    }

    @Override
    public List<UserInfoDTO> getAllUsers() {
        return userRepository.findAll().stream().map((u) -> mapper.userToUserInfoDTO(u)).toList();
    }
}
