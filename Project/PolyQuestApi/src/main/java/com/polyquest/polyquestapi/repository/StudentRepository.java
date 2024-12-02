package com.polyquest.polyquestapi.repository;

//JpaRepository is a Spring Data interface that provides methods to interact with the database.
//It comes with built-in methods like save(), findById(), findAll(), deleteById(), etc.
//When extending JpaRepository, you get these CRUD methods out of the box without needing to write SQL queries.
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.polyquest.polyquestapi.model.Student;

@Repository
public interface StudentRepository extends JpaRepository<Student, Integer> {
    // Custom queries can be defined here if needed
}
