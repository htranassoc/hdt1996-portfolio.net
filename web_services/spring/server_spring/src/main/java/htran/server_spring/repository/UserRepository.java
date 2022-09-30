package htran.server_spring.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import htran.server_spring.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long>{
    
}
