package com.as.dndwebsite;

import com.as.dndwebsite.util.ConvertToJpg;
import com.as.dndwebsite.util.Converter;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class DnDWebsiteApplication {

	public static void main(String[] args) {
		SpringApplication.run(DnDWebsiteApplication.class, args);
	}

	@Bean
	public static Converter setConverter(){
		return new ConvertToJpg();
	}
}
