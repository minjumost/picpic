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

import com.picpic.common.exception.ApiException;
import com.picpic.common.exception.ErrorCode;
import com.picpic.entity.Member;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private final JwtTokenProvider jwtTokenProvider;

	@Override
	protected void doFilterInternal(HttpServletRequest request,
		HttpServletResponse response,
		FilterChain filterChain) throws ServletException, IOException {
		String token = jwtTokenProvider.resolveToken(request);

		if (token == null) {
			throw new ApiException(ErrorCode.UNAUTHORIZED);
		}

		jwtTokenProvider.validateToken(token);
		Long memberId = jwtTokenProvider.getMemberId(token);
		Member.Role role = jwtTokenProvider.getRole(token);

		UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
			memberId,
			null,
			roleToAuthorities(role)
		);

		SecurityContextHolder.getContext().setAuthentication(authentication);

		filterChain.doFilter(request, response);
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
		put(
			HttpMethod.GET, Arrays.asList(
				"/api/v1/oauth/ssafy/**"
			)

		);
	}};

	@Override
	protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
		HttpMethod currentMethod = HttpMethod.valueOf(request.getMethod());
		String uri = request.getRequestURI();

		// ✅ SSAFY 인증 관련 요청은 필터 타지 않도록
		if (uri.startsWith("/api/v1/oauth/ssafy")) {
			return true;
		}

		// 기존 로직 유지 (method + 패턴 기반 스킵 처리)
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

