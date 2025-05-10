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
@Table("session")
public class Session {
	@Id
	private Long sessionId;
	private Long memberId;       // 방장
	private String sessionCode;
	private Long frameId;
	private Long backgroundId;
	private String password;

	@Builder.Default
	private Integer status = 0; // 0=WAITING, 1=PHOTO, 2=DECORATE, 3=RESULT

	@CreatedDate
	private LocalDateTime createdAt;

	@LastModifiedDate
	private LocalDateTime updatedAt;

	@Builder.Default
	private LocalDateTime deletedAt = null;
}
