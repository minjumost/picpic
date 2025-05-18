package com.picpic.auth;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.picpic.common.filter.ExceptionHandlerFilter;
import com.picpic.common.filter.LogFilter;
import com.picpic.common.filter.RateLimitFilter;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

	private final JwtTokenProvider jwtTokenProvider;

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http, RateLimitFilter rateLimitFilter,
		ExceptionHandlerFilter exceptionHandlerFilter,
		JwtAuthenticationFilter jwtAuthenticationFilter, LogFilter logFilter) throws
		Exception {
		return http
			.cors(cors -> cors.configurationSource(corsConfigurationSource()))
			.csrf(AbstractHttpConfigurer::disable)
			.sessionManagement(
				sessionManagement -> sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
			.addFilterBefore(rateLimitFilter, UsernamePasswordAuthenticationFilter.class)
			.addFilterBefore(jwtAuthenticationFilter, RateLimitFilter.class)
			.addFilterBefore(exceptionHandlerFilter, JwtAuthenticationFilter.class)
			.addFilterBefore(logFilter, ExceptionHandlerFilter.class)

			.authorizeHttpRequests(
				authorizeRequests ->
					authorizeRequests.requestMatchers(HttpMethod.POST, "api/v1/auth/guest")
						.permitAll()
						.anyRequest().authenticated()).build();

	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();

		configuration.setAllowedOrigins(Arrays.asList(
			"http://127.0.0.1:5500",
			"http://localhost:5173",
			"https://localhost:5173",
			"https://minipia.co.kr",
			"https://172.30.1.20:5173"
		));

		configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
		configuration.setAllowedHeaders(Arrays.asList("*"));
		configuration.setAllowCredentials(true);
		configuration.setMaxAge(3600L);

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);

		return source;
	}

	@Bean
	public RateLimitFilter rateLimitFilter() {
		return new RateLimitFilter(jwtTokenProvider);
	}

	@Bean
	public JwtAuthenticationFilter jwtAuthenticationFilter() {
		return new JwtAuthenticationFilter(jwtTokenProvider);
	}

	@Bean
	public ExceptionHandlerFilter exceptionHandlerFilter() {
		return new ExceptionHandlerFilter();
	}

	@Bean
	public LogFilter logFilter() {
		return new LogFilter();
	}

}
