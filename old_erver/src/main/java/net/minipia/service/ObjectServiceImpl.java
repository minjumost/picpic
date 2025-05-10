package net.minipia.service;


import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import net.minipia.dto.ReadAllObjectsResponseDTO;
import net.minipia.dto.common.ObjectDTO;
import net.minipia.repository.ObjectRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ObjectServiceImpl implements ObjectService {

	private final ObjectRepository objectRepository;

	@Override
	public ReadAllObjectsResponseDTO readAllObjects() {

		List<ObjectDTO> tiles = objectRepository.findAllByType((byte)0).stream()
			.filter(object -> object.getDeletedAt() == null)
			.map(object -> new ObjectDTO(
				object.getId(),
				object.getType(),
				object.getImageUrl(),
				object.getWidth(),
				object.getHeight(),
				object.getCreatedAt(),
				object.getUpdatedAt()
			))
			.collect(Collectors.toList());

		List<ObjectDTO> objects = objectRepository.findAllByType((byte)1).stream()
			.filter(object -> object.getDeletedAt() == null)
			.map(object -> new ObjectDTO(
				object.getId(),
				object.getType(),
				object.getImageUrl(),
				object.getWidth(),
				object.getHeight(),
				object.getCreatedAt(),
				object.getUpdatedAt()
			))
			.collect(Collectors.toList());

		List<ObjectDTO> walls = objectRepository.findAllByType((byte)2).stream()
			.filter(object -> object.getDeletedAt() == null)
			.map(object -> new ObjectDTO(
				object.getId(),
				object.getType(),
				object.getImageUrl(),
				object.getWidth(),
				object.getHeight(),
				object.getCreatedAt(),
				object.getUpdatedAt()
			))
			.collect(Collectors.toList());

		return new ReadAllObjectsResponseDTO(tiles, objects, walls);
	}
}
