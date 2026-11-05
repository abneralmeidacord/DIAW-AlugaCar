package br.com.alugacar;

import java.time.Clock;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@SpringBootApplication
public class AlugaCarApplication {
    public static void main(String[] args) {
        SpringApplication.run(AlugaCarApplication.class, args);
    }

    @Bean
    PasswordEncoder passwordEncoder(@Value("${app.password-strength:12}") int strength) {
        return new BCryptPasswordEncoder(strength);
    }

    @Bean
    Clock clock() {
        return Clock.systemUTC();
    }

    @Bean
    SecurityFilterChain security(HttpSecurity http, CorsConfigurationSource cors) throws Exception {
        return http
                .cors(config -> config.configurationSource(cors))
                .csrf(config -> config.csrfTokenRequestHandler(new CsrfTokenRequestAttributeHandler()))
                .authorizeHttpRequests(config -> config
                        .requestMatchers("/api/auth/csrf", "/api/auth/register", "/api/auth/login", "/api/health",
                                "/error")
                        .permitAll()
                        .anyRequest().authenticated())
                .formLogin(config -> config
                        .loginProcessingUrl("/api/auth/login").usernameParameter("login").passwordParameter("senha")
                        .successHandler((request, response, authentication) -> response.setStatus(204))
                        .failureHandler((request, response, error) -> {
                            response.setStatus(401);
                            response.setContentType("application/json;charset=UTF-8");
                            response.getWriter().write("{\"message\":\"Confira seu e-mail e sua senha.\"}");
                        }))
                .logout(config -> config.logoutUrl("/api/auth/logout").deleteCookies("JSESSIONID")
                        .logoutSuccessHandler((request, response, authentication) -> response.setStatus(204)))
                .exceptionHandling(config -> config
                        .authenticationEntryPoint((request, response, error) -> {
                            response.setStatus(401);
                            response.setContentType("application/json;charset=UTF-8");
                            response.getWriter().write("{\"message\":\"Entre no sistema para continuar.\"}");
                        })
                        .accessDeniedHandler((request, response, error) -> {
                            response.setStatus(403);
                            response.setContentType("application/json;charset=UTF-8");
                            response.getWriter().write(
                                    "{\"message\":\"Acesso negado ou token CSRF inválido. Atualize a página e tente novamente.\"}");
                        }))
                .build();
    }

    @Bean
    CorsConfigurationSource cors(@Value("${app.frontend-origin:http://localhost:5173}") List<String> origins) {
        var config = new CorsConfiguration();
        config.setAllowedOrigins(origins);
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Content-Type", "X-CSRF-TOKEN"));
        config.setAllowCredentials(true);
        var source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);
        return source;
    }
}
