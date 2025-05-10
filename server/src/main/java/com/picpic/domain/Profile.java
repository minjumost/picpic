package com.picpic.domain;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.relational.core.mapping.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("profile")
public class Profile {
	@Id
	private Long comboId;
	private String color;
	private String profileImageUrl;
	private String adjective; // 예: "웃는"
	private String noun;      // 예: "고양이"

	@CreatedDate
	private LocalDateTime createdAt;

	@LastModifiedDate
	private LocalDateTime updatedAt;

	@Builder.Default
	private LocalDateTime deletedAt = null;
}
