package com.ngo.foundation;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class NgoBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(NgoBackendApplication.class, args);
	}

}
