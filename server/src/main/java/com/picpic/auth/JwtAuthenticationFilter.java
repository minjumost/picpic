package com.picpic.auth;

import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import com.picpic.entity.Member;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private final JwtTokenProvider jwtTokenProvider;

	private static final String TOKEN_COOKIE_NAME = "access-token";

	@Override
	protected void doFilterInternal(HttpServletRequest request,
		HttpServletResponse response,
		FilterChain filterChain) throws ServletException, IOException {
		String token = resolveToken(request);

		if (token != null && jwtTokenProvider.validateToken(token)) {
			Long memberId = jwtTokenProvider.getMemberId(token);
			Member.Role role = jwtTokenProvider.getRole(token);

			UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
				memberId,
				null,
				roleToAuthorities(role)
			);

			SecurityContextHolder.getContext().setAuthentication(authentication);
		}

		filterChain.doFilter(request, response);
	}

	private String resolveToken(HttpServletRequest request) {
		if (request.getCookies() == null)
			return null;

		return Arrays.stream(request.getCookies())
			.filter(cookie -> TOKEN_COOKIE_NAME.equals(cookie.getName()))
			.findFirst()
			.map(Cookie::getValue)
			.orElse(null);
	}

	private static List<GrantedAuthority> roleToAuthorities(
		Member.Role role) {
		return java.util.List.of(() -> "ROLE_" + role.name());
	}

	private Map<HttpMethod, List<String>> methodUrlPatterns = new HashMap<HttpMethod, List<String>>() {{
		put(
			HttpMethod.POST, Arrays.asList(
				"/api/v1/auth/guest"
			)
		);
	}};

	@Override
	protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
		// 현재 요청의 HTTP 메서드를 가져옵니다.
		HttpMethod currentMethod = HttpMethod.valueOf(request.getMethod());

		if (methodUrlPatterns.containsKey(currentMethod)) {
			List<String> urlPatterns = methodUrlPatterns.get(currentMethod);
			for (String pattern : urlPatterns) {
				if (new AntPathRequestMatcher(pattern).matches(request)) {
					return true;
				}
			}
		}
		return false;
	}
}

