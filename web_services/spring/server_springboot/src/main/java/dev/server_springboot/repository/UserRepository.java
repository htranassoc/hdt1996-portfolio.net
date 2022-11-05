package dev.server_springboot.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import dev.server_springboot.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long>{
    
}
