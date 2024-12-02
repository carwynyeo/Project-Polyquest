package com.polyquest.polyquestapi;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

import java.util.Arrays;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf().disable()  // Disable CSRF if not needed
                .authorizeHttpRequests(authz -> authz
                        .anyRequest().permitAll()  // Allow any request without authentication
                )
                .cors(withDefaults());  // Apply default CORS settings from CorsConfigurationSource

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3001"));  // Replace "*" with specific allowed origins
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));  // Allowed HTTP methods
        configuration.setAllowedHeaders(Arrays.asList("*"));  // Allow all headers
        configuration.setAllowCredentials(true);  // Allow credentials (e.g., cookies, tokens)
        configuration.setMaxAge(3600L);  // Set max age for preflight request caching

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);  // Apply the CORS configuration to all paths
        return source;
    }

}
