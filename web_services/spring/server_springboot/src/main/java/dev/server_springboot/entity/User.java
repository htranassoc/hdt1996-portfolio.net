package dev.server_springboot.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private long id;
    @Column(name="first_name")
    private String first_name;
    @Column(name="last_name")
    private String last_name;
    @Column(name="email")
    private String email;

    public User ()
    {
        
    }
    public User(String first_name, String last_name, String email)
    {
        super();
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
    }
    public void setID(long id)
    {
        this.id = id;
    }
    public void setFirstName(String first_name)
    {
        this.first_name = first_name;
    }
    public void setLastName(String last_name)
    {
        this.last_name = last_name;
    }
    public void setEmail(String email)
    {
        this.email = email;
    }

    public long getID()
    {
        return id;
    }

    public String getFirstName()
    {
        return first_name;
    }
    public String getLastName()
    {
        return last_name;
    }
    public String getEmail()
    {
        return email;
    }

}
