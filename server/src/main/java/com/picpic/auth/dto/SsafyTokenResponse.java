package com.picpic.auth.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record SsafyTokenResponse(
	@JsonProperty("access_token")
	String accessToken,

	@JsonProperty("refresh_token")
	String refreshToken,

	@JsonProperty("token_type")
	String tokenType,

	@JsonProperty("expires_in")
	String expiresIn,

	@JsonProperty("refresh_token_expires_in")
	String refreshTokenExpiresIn
) {
}

