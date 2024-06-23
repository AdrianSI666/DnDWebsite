package com.as.dndwebsite.user;

import com.as.dndwebsite.user.DTOs.UserInfoDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository

public interface UserRepository extends JpaRepository<User,Long> {

    Optional<User> findUserById(Long id);
    Optional<User> findUserByEmail(String email);
    Optional<User> findUserByUserName(String userName);

//    Page<UserInfoDTO> findAllUsersByName(String userName, Pageable paging);
}
