package com.ba;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@Slf4j
@SpringBootApplication
public class BaApplication {

	public static void main(String[] args) {
		SpringApplication.run(BaApplication.class, args);
		log.info("test2");
	}
}
