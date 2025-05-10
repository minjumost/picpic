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
@Table("stroke")
public class Stroke {
	@Id
	private Long strokeId;
	private Long photoId;
	private Long participantId;
	private Integer tool; // 0=pen, 1=eraser
	private String color;
	private Integer thickness;
	private String pointsJson;

	@CreatedDate
	private LocalDateTime createdAt;

	@LastModifiedDate
	private LocalDateTime updatedAt;

	@Builder.Default
	private LocalDateTime deletedAt = null;
}
