package com.picpic.auth.dto;

public record GuestLoginResultDTO(
	Long memberId,
	String accessToken) {
}
