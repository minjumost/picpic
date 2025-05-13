package com.picpic.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.picpic.dto.frame.GetFrameListResponseDTO;
import com.picpic.entity.Frame;
import com.picpic.repository.FrameRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class FrameService {

	private final FrameRepository frameRepository;

	public List<GetFrameListResponseDTO> getFrameList() {
		List<Frame> frameList = frameRepository.findAll();

		List<GetFrameListResponseDTO> res = frameList.stream().map(frame -> {
			return GetFrameListResponseDTO.builder()
				.frameId(frame.getFrameId())
				.name(frame.getName())
				.slotCount(frame.getSlotCount())
				.frameImageUrl(frame.getFrameImageUrl())
				.build();
		}).toList();

		log.info("프레임 목록 반환");

		return res;
	}
}
