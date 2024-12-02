package com.polyquest.polyquestapi;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.SpringApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EntityScan(basePackages = "com.polyquest.polyquestapi.model") // Specify the package of your entities
@EnableJpaRepositories(basePackages = "com.polyquest.polyquestapi.repository") // Specify the repository package
public class  PolyQuestApiApplication {
	public static void main(String[] args) {
		SpringApplication.run(PolyQuestApiApplication.class, args);
	}
}
