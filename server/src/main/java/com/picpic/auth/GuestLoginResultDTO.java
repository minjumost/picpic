package com.picpic.auth;

public record GuestLoginResultDTO(
	Long memberId,
	String accessToken) {
}
