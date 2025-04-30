package net.minipia.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import net.minipia.apiPayload.code.status.ErrorStatus;
import net.minipia.apiPayload.exception.GeneralException;
import net.minipia.dto.CreateRoomResponseDTO;
import net.minipia.dto.ReadObjectsInRangeRequestDTO;
import net.minipia.dto.ReadObjectsInRangeResponseDTO;
import net.minipia.entity.Room;
import net.minipia.entity.RoomObject;
import net.minipia.repository.RoomObjectRepository;
import net.minipia.repository.RoomRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {

	private final RoomRepository roomRepository;
	private final RoomObjectRepository roomObjectRepository;
	private static final char[] BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".toCharArray();
	private static final int CODE_LENGTH = 8;
	private static final Random RANDOM = new Random();

	@Override
	public CreateRoomResponseDTO createRoom() {
		String code;
		do {
			StringBuilder sb = new StringBuilder(CODE_LENGTH);
			for (int i = 0; i < CODE_LENGTH; i++) {
				sb.append(BASE62[RANDOM.nextInt(BASE62.length)]);
			}
			code = sb.toString().toLowerCase();
		} while (roomRepository.existsByCode(code));

		Room room = Room.builder()
			.code(code)
			.build();

		roomRepository.save(room);

		return CreateRoomResponseDTO.builder().code(code).build();
	}

	@Override
	public List<ReadObjectsInRangeResponseDTO> readObjectsInRange(String code, ReadObjectsInRangeRequestDTO req) {
		Room room = roomRepository.findByCode(code)
			.orElseThrow(() -> {
				log.debug("코드가 {}인 방이 존재하지 않습니다.", code);
				return new GeneralException(ErrorStatus.NOT_FOUND_ROOM_BY_CODE);
			});

		List<RoomObject> roomObjectList = roomObjectRepository.findAllByRoom(room);
		log.info("코드가 {}인 방에 배치된 가구 수는 {}입니다.", code, roomObjectList.size());

		List<ReadObjectsInRangeResponseDTO> res = roomObjectList.stream()
			.filter(ro -> {
				int oStartX = ro.getPosX() - ro.getObject().getWidth() / 2;
				int oStartY = ro.getPosY() - ro.getObject().getHeight() / 2;
				int oEndX = ro.getPosX() + ro.getObject().getWidth() / 2;
				int oEndY = ro.getPosY() + ro.getObject().getHeight() / 2;
				return !(oEndX < req.startX() && oEndY < req.startY()) &&
					!(oStartX > req.endX() && oStartY > req.endY());
			})
			.map(ro -> new ReadObjectsInRangeResponseDTO(
				ro.getId(),
				ro.getObject().getType(),
				ro.getObject().getImageUrl(),
				ro.getObject().getWidth(),
				ro.getObject().getHeight(),
				ro.getPosX(),
				ro.getPosY()
			))
			.collect(Collectors.toList());

		return res;
	}

	@Override
	public void enterRoom(String code) {

		Room room = roomRepository.findByCode(code)
			.orElseThrow(() -> new NotFoundException(ErrorStatus.INVALID_ROOM_CODE));

		log.info("[방 입장] code={}", code);
	}
}
