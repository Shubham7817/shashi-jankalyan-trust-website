package com.ngo.foundation.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Exposes the local "uploads" directory to the web under the "/uploads/**" path
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
    }
}