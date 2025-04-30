package net.minipia.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record PlaceObjectRequestDTO(
	@NotBlank(message = "8자리 문자열입니다.")
	@Size(min = 8, max = 8, message = "8자리 문자열입니다.")
	String code,

	@NotNull(message = "1 이상의 정수여야 합니다.")
	@Positive(message = "1 이상의 정수여야 합니다.")
	Long objectId,

	@NotNull(message = "0 이상의 정수여야 합니다.")
	@PositiveOrZero(message = "0 이상의 정수여야 합니다.")
	Integer posX,

	@NotNull(message = "0 이상의 정수여야 합니다.")
	@PositiveOrZero(message = "0 이상의 정수여야 합니다.")
	Integer posY
) {
}
