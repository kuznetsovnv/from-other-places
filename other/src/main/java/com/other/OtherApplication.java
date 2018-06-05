package com.other;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@Slf4j
@SpringBootApplication
public class OtherApplication {

	public static void main(String[] args) {
		SpringApplication.run(OtherApplication.class, args);
		log.info("test2");
	}
}
