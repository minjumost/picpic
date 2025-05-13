package com.picpic.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.picpic.dto.background.GetBackgroundListResponseDTO;
import com.picpic.entity.Background;
import com.picpic.repository.BackgroundRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class BackgroundService {

	private final BackgroundRepository backgroundRepository;

	public List<GetBackgroundListResponseDTO> getBackgroundList() {
		List<Background> backgroundList = backgroundRepository.findAll();

		List<GetBackgroundListResponseDTO> res = backgroundList.stream().map(background -> {
			return GetBackgroundListResponseDTO.builder()
				.backgroundId(background.getBackgroundId())
				.name(background.getName())
				.backgroundImageUrl(background.getBackgroundImageUrl())
				.build();
		}).toList();

		log.info("배경화면 목록 반환");
		
		return res;
	}

}
