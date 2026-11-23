package com.ngo.foundation.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(
                        "https://shashi-jankalyan-trust-website-dusky.vercel.app",
                        "http://localhost:5173",
                        "https://shashijankalyantrust.com",
                        "https://shashijankalyantrust.org",
                        "https://www.shashijankalyantrust.com",
                        "https://www.shashijankalyantrust.org"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(false);
    }
}