package com.picpic.auth;

import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Base64;
import java.util.Date;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.picpic.common.exception.ApiException;
import com.picpic.common.exception.ErrorCode;
import com.picpic.entity.Member;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

@Component
public class JwtTokenProvider {

	@Value("${jwt.secret}")
	private String secret;

	@Value("${jwt.expiration}")
	private Long expiration;

	public String generateToken(Long memberId, Member.Role role) {
		Date now = new Date();
		return Jwts.builder()
			.subject(String.valueOf(memberId))
			.claim("role", role.name())
			.issuedAt(now)
			.expiration(new Date(now.getTime() + expiration))
			.signWith(getSignInKey())
			.compact();
	}

	public String createToken() {
		Date now = new Date();
		return Jwts.builder()
			.issuedAt(now)
			.expiration(new Date(now.getTime() + expiration))
			.signWith(getSignInKey())
			.compact();
	}

	public boolean validateToken(String token) {
		try {
			Jwts.parser()
				.verifyWith(getSignInKey())
				.build()
				.parseSignedClaims(token)
				.getPayload();

			return true;
		} catch (ExpiredJwtException e) {
			throw new ApiException(ErrorCode.EXPIRED_TOKEN);
		} catch (JwtException e) {
			throw new ApiException(ErrorCode.UNAVAILABLE_TOKEN);
		}
	}

	public Long getMemberId(String token) {
		Claims claims = parseClaims(token);
		return Long.parseLong(claims.getSubject());
	}

	public Member.Role getRole(String token) {
		Claims claims = parseClaims(token);
		return Member.Role.valueOf(claims.get("role", String.class));
	}

	public Claims parseClaims(String token) {
		return Jwts.parser()
			.verifyWith(getSignInKey())
			.build()
			.parseSignedClaims(token)
			.getPayload();
	}

	private SecretKey getSignInKey() {
		byte[] bytes = Base64.getDecoder()
			.decode(secret.getBytes(StandardCharsets.UTF_8));
		return new SecretKeySpec(bytes, "HmacSHA256");
	}

	public String resolveToken(HttpServletRequest request) {
		if (request.getCookies() == null)
			return null;

		return Arrays.stream(request.getCookies())
			.filter(cookie -> "access-token".equals(cookie.getName()))
			.findFirst()
			.map(Cookie::getValue)
			.orElse(null);
	}

}
