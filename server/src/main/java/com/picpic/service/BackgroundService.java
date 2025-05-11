package com.picpic.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.picpic.dto.background.GetBackgroundListResponseDTO;
import com.picpic.entity.Background;
import com.picpic.repository.BackgroundRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BackgroundService {

	private final BackgroundRepository backgroundRepository;

	public List<GetBackgroundListResponseDTO> getBackgroundList() {
		List<Background> backgroundList = backgroundRepository.findAll();

		return backgroundList.stream().map(background -> {
			return GetBackgroundListResponseDTO.builder()
				.backgroundId(background.getBackgroundId())
				.name(background.getName())
				.backgroundImageUrl(background.getBackgroundImageUrl())
				.build();
		}).toList();
	}

}
