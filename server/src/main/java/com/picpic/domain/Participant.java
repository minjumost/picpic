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
@Table("participant")
public class Participant {
	@Id
	private Long participantId;
	private Long sessionId;
	private Long memberId;

	@Builder.Default
	private Integer status = 0; // 0=JOINED, 1=PHOTO_SUBMITTED, 2=DECORATING, 3=DECORATED, 4=VIEWING_RESULT, 5=LEFT

	@CreatedDate
	private LocalDateTime joinedAt;

	@LastModifiedDate
	private LocalDateTime updatedAt;

	@Builder.Default
	private LocalDateTime deletedAt = null;
}
