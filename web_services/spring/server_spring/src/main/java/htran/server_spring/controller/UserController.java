package htran.server_spring.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import htran.server_spring.entity.User;
import htran.server_spring.exception.ResourceNotFoundException;
import htran.server_spring.repository.UserRepository;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserRepository userRepository;
    // get all users

    @GetMapping
    public List<User> getAllUsers()
    {
        return this.userRepository.findAll();
    }
    // get user by id
    @GetMapping("/{id}")
    public User getUserById(@PathVariable (value = "id") long userId)
    {  //returns Optional<User> must have exception handling
        return this.userRepository.findById(userId) 
            .orElseThrow(() -> new ResourceNotFoundException("Unknown User ID: "+userId));
    }
    // create user
    @PostMapping
    public User createUser(@RequestBody User user)
    {
        return this.userRepository.save(user);
    }
    // update user
    @PutMapping("/{id}")
    public User updateUser(@RequestBody User user_data, @PathVariable ("id") long userId)
    {
        User user = this.userRepository.findById(userId) //returns Optional<User> must have exception handling
            .orElseThrow(() -> new ResourceNotFoundException("Unknown User ID: "+userId));
        System.out.println(user_data.getFirstName());
        System.out.println(user_data.getLastName());
        System.out.println(user_data.getEmail());
        user.setFirstName(user_data.getFirstName());
        user.setLastName(user_data.getLastName());
        user.setEmail(user_data.getEmail());
        this.userRepository.save(user);
        System.out.println(user.getFirstName());
        System.out.println(user.getLastName());
        System.out.println(user.getEmail());
        return user;        
    }
    // delete user by id
    @DeleteMapping("/{id}")
    public ResponseEntity<User> deleteUser(@PathVariable ("id") long userId)
    {
        User user = this.userRepository.findById(userId) //returns Optional<User> must have exception handling
            .orElseThrow
            ( 
                () -> new ResourceNotFoundException("User not found with id :"+userId)
            );
        this.userRepository.delete(user);
        return ResponseEntity.ok().build();
    }
}
